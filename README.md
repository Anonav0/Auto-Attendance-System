![alt text](image.png)

# Auto Attendance System

A simple Python-based automated attendance system that uses face recognition to take and record attendance from webcam images. This repository contains a lightweight GUI, face encoding and matching logic, and helpers to save attendance records.

## Project Overview

The system captures images from a webcam or loads saved images, computes 128-D face encodings using a deep metric network, compares encodings with a known faces database, and updates an attendance sheet (Excel). A lightweight local GUI (built with Eel) provides add-student and take-attendance flows.

## Features

- Capture images from webcam
- Detect faces and compute 128-D face encodings
- Match detected faces against a known faces database
- Save attendance records to an Excel sheet
- Simple local GUI via Eel for adding students and taking attendance

## Project Structure

- `attendance.py` — main entry point for running the attendance tool
- `requirements.txt` — Python dependencies
- `assets/` — stored images, encodings, and other static assets
- `scripts/setup_ubuntu.sh` — helper script to install system-level prerequisites on Ubuntu
- `web/` — frontend assets used by the Eel GUI (`index.html`, `main.js`, `style.css`)
- `README.md` — this file

## Requirements

The project depends on the following Python packages (from `requirements.txt`):

- Eel == 0.12.4
- face_recognition == 1.3.0
- opencv-contrib-python >= 4.10.0.84
- openpyxl >= 3.1.5

You will also need:

- Python 3.8 or newer
- For Linux: build tools and system libraries required by `dlib`/`face_recognition` (see `scripts/setup_ubuntu.sh`)

## Installation

Linux (Ubuntu / Debian)

1. Make the setup script executable and run it to install system dependencies (needs sudo):

```bash
chmod +x scripts/setup_ubuntu.sh
./scripts/setup_ubuntu.sh
```

2. Create and activate a virtual environment, then install Python dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Other systems (macOS / Windows)

1. Install Python 3.8+ and a suitable build toolchain (for macOS, Xcode command line tools; for Windows, MSVC toolset).
2. Create and activate a virtual environment (macOS / Linux: `python3 -m venv .venv && source .venv/bin/activate`; Windows PowerShell: `python -m venv .venv; .\.venv\Scripts\Activate.ps1`).
3. Install Python packages:

```bash
pip install -r requirements.txt
```

Notes:

- The `face_recognition` package requires native libraries (dlib). If installation fails, consult the package docs for platform-specific instructions.

## Run the Project

1. Activate your virtual environment (see Installation).
2. Run the main script:

```bash
python attendance.py
```

On first run, follow GUI prompts to add known students (their images/encodings will be saved to `assets/`). Use the "Take Attendance" flow to scan the webcam and update the Excel attendance sheet.

For Linux :
From the project root, start the application with:

```bash
.venv/bin/python attendance.py
```

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit changes and push to your fork.
4. Open a pull request describing your change.

Please keep changes focused and add tests where appropriate.

## Acknowledgements

- `face_recognition` project for face encoding and matching
- `Eel` for the lightweight GUI
- `OpenCV` for image handling and face detection utilities

## Contact

For questions or support, please open an issue or contact the maintainer at: swarnavokhanra@gmail.com

## Author & Generation Statement

This project was authored and is maintained by **Swarnavo Khanra**. The documentation for this repository was generated using the **GPT-5 mini** LLM model and has been manually reviewed and verified.

---
