# Silent Guard

Silent Guard is an intelligent, camera-based AI system designed to detect silent drownings in swimming pools in real time and alert lifeguards or operators instantly — to save lives.
Silent Guard’s mission is to detect silent drowning incidents as they happen by analyzing live video feeds from multiple cameras and sending immediate alerts.

## What Is Silent Drowning?
A situation where a person drowns without showing obvious signs, such as shouting or waving for help.
* Research indicates that a significant portion of drowning incidents happen without visible warning signs.
* Main causes: loss of consciousness and fatigue.

## high-level architecture diagram
<img width="1236" height="696" alt="Screenshot 2025-10-06 at 16 15 54" src="https://github.com/user-attachments/assets/87ddf07a-f362-4527-b629-540b975a89da" />

## Swimmer States
<img width="1231" height="691" alt="Screenshot 2025-10-06 at 16 16 41" src="https://github.com/user-attachments/assets/a97a407f-e520-40e9-93e8-bffe2fc6c997" />

## Project Structure

The Silent Guard system consists of three main components working together seamlessly:
a modern web client for monitoring and control,
a computer vision server for real-time video analysis,
and a camera simulator that provides test streams for development and validation.

### 🖥️ Silent Guard Client

The Silent Guard Client is a Next.js 14 web application that provides a modern and intuitive dashboard for monitoring swimming pool cameras, managing devices, and reviewing real-time and recorded footage.
It serves as the main control center for lifeguards, pool operators, and maintenance staff.

**Technologies:**

- Next.js 14 – React-based framework for high-performance web apps
- TypeScript – Type-safe development for better scalability
- Tailwind CSS – Utility-first styling for responsive design
- Shadcn/ui – Modern component library for consistent UI
- Drizzle ORM – Lightweight ORM for data persistence
- NextAuth.js – Secure authentication and session handling

**Features:**

- Multi-Camera Management: Add, edit, and organize multiple swimming pool cameras
- Camera Categorization: Group cameras by location or type (e.g., indoor, outdoor, training pool)
- Live Video Monitoring: Watch real-time feeds from several cameras simultaneously
- Integrated Alerts: Receive immediate danger or inactivity notifications from the server
- Playback & Recording: Access recorded footage for review and investigation
- User Access Control: Manage permissions for operators, admins, and technicians
- Seamless Communication: Interacts directly with the detection server via REST and WebSocket APIs for instant updates

### 🤖 Silent Guard Server

A Python-based computer-vision server that analyzes live video streams to detect potential silent drowning events in real time.

**Technologies:**

- Flask — HTTP API & streaming endpoints
- requests — pulling MJPEG streams (with auth headers passthrough)
- OpenCV — frame decoding/encoding & preprocessing
- NumPy — array operations for image buffers
- Ultralytics — YOLO model for per-frame detection
- deep-sort-realtime — multi-object tracking across frames
- multiprocessing / threading — one process per unique stream (URL+auth), shared memory for multi-viewer fan-out

**How it works:**

- One process per stream: the first viewer of a given (URL, Authorization) spins up a worker process to pull the camera’s MJPEG via requests (streaming), parse JPEG boundaries (0xFFD8 .. 0xFFD9), and decode frames with OpenCV.
- Detection & tracking: each frame goes through a YOLO detector (Ultralytics). Detections are fed to Deep SORT for stable IDs across time.
- Annotation & status: frames are optionally annotated (bounding boxes / overlays), then re-encoded to JPEG. A per-frame “Metadata” header is attached to the HTTP multipart chunk with the danger/status payload (e.g., inferred “DANGER / SAFE / SUSPECTED” or similar).
- Multi-viewer fan-out: the worker writes the latest encoded frame into shared memory; concurrent viewers of the same stream read and serve it without duplicating the upstream pull. When the last viewer disconnects, the process is terminated and cleaned up.
- Concurrency: lightweight threading around request/response streaming; locks coordinate viewer counts and lifecycle.

### 📷 Silent Guard Camera Simulator

To develop and test the system safely, we created a camera simulator that mimics real pool cameras.
It continuously streams prerecorded or generated video footage (e.g., swimming activity) over MJPEG, allowing the server to process it exactly as if it were a real IP camera.

**Technologies:**
- Python – Core script for video streaming
- OpenCV – Frame reading and encoding
- Flask – MJPEG streaming endpoint

**Features:**
- Simulates multiple camera feeds simultaneously
- Enables development and testing without real camera hardware
- Supports configurable frame rate and resolution

## Installation and Setup

### Client

```bash
# 1. Navigate to the client folder
cd silent-guard-client

# 2. Install dependencies
npm install

# 4. Run the development server
npm run dev
```

### Server

```bash
# 1. Navigate to the server folder
cd silent-guard-server/main-server

# 2. Install Python & venv (if not already installed)
sudo apt update
sudo apt install python3-pip python3-venv -y

# 3. Create a virtual environment
python3 -m venv venv

# 4. Activate the virtual environment
source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Run the server
python app.py
```

### Camera
```bash
# 1. Install dependencies (if not already installed)
sudo apt update
sudo apt install python3-venv ffmpeg -y

# 2. Create and activate a virtual environment
python3 -m venv myenv
source myenv/bin/activate

# 3. Install required packages
pip install flask opencv-python

# 4. Run
python camera_simulator.py
```

