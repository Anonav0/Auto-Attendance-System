let cameraStream = null;
let cameraReady = false;

function showAlert(type, title, message, options = {}) {
  const container = document.getElementById("alert_container");
  if (!container) {
    return;
  }

  const card = document.createElement("div");
  card.className = `alert-card ${type}`;
  const safeMessage = (message || "").replace(/\n/g, "<br>");
  const iconMap = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  const actionMarkup = options.actions
    ? options.actions
        .map(
          (action) =>
            `<button type="button" data-action="${action.id}">${action.label}</button>`,
        )
        .join("")
    : "";

  card.innerHTML = `
    <div class="alert-icon">${iconMap[type] || "i"}</div>
    <div class="alert-content">
      <h4>${title}</h4>
      <p>${safeMessage}</p>
      ${actionMarkup ? `<div class="alert-actions">${actionMarkup}</div>` : ""}
    </div>
  `;

  container.appendChild(card);

  card.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = options.actions.find(
        (item) => item.id === button.dataset.action,
      );
      if (action && action.handler) {
        action.handler();
      }
      card.remove();
    });
  });

  if (options.duration !== 0) {
    window.setTimeout(() => {
      card.remove();
    }, options.duration || 5000);
  }
}

function show_notification(type, title, message, options = {}) {
  showAlert(type, title, message, options);
}

eel.expose(show_notification);

function start_stream() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    cameraReady = false;
  }

  const status = document.getElementById("camera_status");
  if (status) {
    status.textContent = "Starting attendance stream...";
  }

  eel.take_attendance();
}

function handleAttendanceRecorded(details) {
  const title =
    details && details.title ? details.title : "Attendance Recorded";
  const message =
    details && details.message
      ? details.message
      : "Attendance was recorded successfully.";
  showAlert("success", title, message, {
    duration: 6000,
  });
}

async function setup() {
  const preview = document.getElementById("camera_preview");
  const status = document.getElementById("camera_status");
  if (!preview) {
    console.error("Camera preview element not found.");
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (status) {
      status.textContent = "Your browser does not support camera access.";
    }
    showAlert(
      "error",
      "Camera access unavailable",
      "Your browser does not support camera access.",
    );
    return;
  }

  try {
    if (status) {
      status.textContent = "Requesting webcam permission...";
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    preview.style.display = "block";
    preview.srcObject = cameraStream;
    preview.onloadedmetadata = async () => {
      try {
        await preview.play();
        if (status) {
          status.textContent = "Webcam is active.";
        }
      } catch (playError) {
        console.error("Unable to start webcam playback:", playError);
        if (status) {
          status.textContent =
            "Webcam stream started but playback was blocked.";
        }
      }
    };

    await preview.play();
    cameraReady = true;
    if (status) {
      status.textContent = "Webcam is active.";
    }
  } catch (error) {
    cameraReady = false;
    console.error("Unable to access camera:", error);
    if (status) {
      status.textContent = "Unable to access the webcam: " + error.message;
    }
    showAlert(
      "error",
      "Camera setup failed",
      "Unable to access the webcam. Please allow camera permission and try again.",
    );
  }
}

async function take_snapshot() {
  const preview = document.getElementById("camera_preview");
  const results = document.getElementById("results");

  if (!cameraReady || !preview || !preview.videoWidth) {
    const status = document.getElementById("camera_status");
    if (status) {
      status.textContent = "Open the webcam first, then take the picture.";
    }
    showAlert(
      "error",
      "Camera not ready",
      "Open the webcam first, then take the picture.",
    );
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = preview.videoWidth;
  canvas.height = preview.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(preview, 0, 0, canvas.width, canvas.height);

  const dataUri = canvas.toDataURL("image/jpeg", 1.0);
  results.innerHTML = '<p>Here is your image:</p><img src="' + dataUri + '"/>';
  await eel.get_image_data(dataUri)();
}

async function add_student() {
  const rollNumber = document.getElementById("rollno").value.trim();
  const status = document.getElementById("camera_status");

  if (!rollNumber) {
    showAlert("error", "Missing roll number", "Enter a roll number first.");
    return;
  }

  const response = await eel.save_student_data(rollNumber)();
  if (status) {
    status.textContent = response || "Student image saved.";
  }

  const isSuccess =
    typeof response === "string" &&
    response.toLowerCase().includes("saved") &&
    !response.toLowerCase().includes("not found");
  if (isSuccess) {
    showAlert(
      "success",
      "Face added successfully",
      "You can add another face, or restart the server to make the newly added student available for attendance.",
      {
        duration: 8000,
        actions: [
          {
            id: "another",
            label: "Add Another Face",
            handler: () => {
              document.getElementById("rollno").focus();
            },
          },
          {
            id: "restart",
            label: "Restart Server",
            handler: () => {
              showAlert(
                "info",
                "Restart required",
                "Please restart the server from the terminal before taking attendance for the new student.",
              );
            },
          },
        ],
      },
    );
  } else {
    showAlert(
      "error",
      "Face enrollment failed",
      response || "The face could not be added. Please try again.",
    );
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraReady = false;
}
