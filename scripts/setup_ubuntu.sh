#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This setup script is intended for Linux."
  exit 1
fi

if [[ ! -f "$project_root/requirements.txt" ]]; then
  echo "requirements.txt not found in $project_root"
  exit 1
fi

if command -v apt-get >/dev/null 2>&1; then
  apt_packages=(
    python3
    python3-pip
    python3-venv
    python3-dev
    build-essential
    cmake
    pkg-config
    libopenblas-dev
    liblapack-dev
    libx11-dev
    libgtk-3-dev
    libjpeg-dev
    libpng-dev
    libtiff-dev
    libavcodec-dev
    libavformat-dev
    libswscale-dev
    libatlas-base-dev
  )

  echo "Installing Linux system packages..."
  if command -v sudo >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y "${apt_packages[@]}"
  else
    apt-get update
    apt-get install -y "${apt_packages[@]}"
  fi
else
  echo "apt-get was not found. Install the equivalent Python build and OpenCV dependencies for your distribution manually."
fi

cd "$project_root"

if [[ ! -d .venv ]]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

source .venv/bin/activate
python -m pip install --upgrade pip wheel "setuptools<81"
python -m pip install -r requirements.txt

echo
echo "Setup complete. The app uses paths relative to the project root."
echo "Keep the assets/ folder next to attendance.py."
echo
echo "Run the app with:"
echo "  .venv/bin/python attendance.py"