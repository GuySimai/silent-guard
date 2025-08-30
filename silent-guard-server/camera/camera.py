from flask import Flask, Response, request
import cv2
import threading
import time
import base64

app = Flask(__name__)

USERNAME = 'admin'
PASSWORD = '1234'
latest_frame = None

def check_auth(auth_header):
    if not auth_header:
        return False
    try:
        method, encoded = auth_header.split()
        if method.lower() != 'basic':
            return False
        decoded = base64.b64decode(encoded).decode('utf-8')
        user, pwd = decoded.split(':')
        return user == USERNAME and pwd == PASSWORD
    except:
        return False

def video_loop():
    global latest_frame
    cap = cv2.VideoCapture("video.mp4")
    fps = cap.get(cv2.CAP_PROP_FPS)
    delay = 1 / fps if fps > 0 else 1 / 25

    print(f"[INFO] Video FPS: {fps}, using delay: {delay:.3f}s")

    next_frame_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            next_frame_time = time.time()
            continue

        _, buffer = cv2.imencode('.jpg', frame)
        latest_frame = buffer.tobytes()

        next_frame_time += delay
        sleep_time = next_frame_time - time.time()
        if sleep_time > 0:
            time.sleep(sleep_time)
        else:
            next_frame_time = time.time()

@app.route('/video')
def video():
    auth = request.headers.get('Authorization')
    if not check_auth(auth):
        return Response(
            'Authentication required',
            401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        )

    def stream():
        while True:
            if latest_frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + latest_frame + b'\r\n')

    return Response(stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    threading.Thread(target=video_loop, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
