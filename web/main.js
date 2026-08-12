let cameraStream = null;
let cameraReady = false;

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
    alert("Your browser does not support camera access.");
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
    alert(
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
    alert("Open the webcam first, then take the picture.");
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
    alert("Enter a roll number first.");
    return;
  }

  const response = await eel.save_student_data(rollNumber)();
  if (status) {
    status.textContent = response || "Student image saved.";
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraReady = false;
}
