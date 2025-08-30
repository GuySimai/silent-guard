import multiprocessing
import requests
import cv2
import numpy as np
from model_predictor import ModelPredictor

manager = multiprocessing.Manager()
active_streams = {}

def bytes_to_frame(jpg_bytes):
    arr = np.frombuffer(jpg_bytes, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)

def frame_to_bytes(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return buffer.tobytes()

def stream_worker(url, headers, shared_memory, memory_lock):
    model = ModelPredictor()
    try:
        r = requests.get(url, stream=True, headers=headers, timeout=5)
        buffer = b""
        while True:
            chunk = r.raw.read(1024)
            if not chunk:
                break
            buffer += chunk

            start = buffer.find(b'\xff\xd8')
            end = buffer.find(b'\xff\xd9')

            if start != -1 and end != -1 and end > start:
                jpg_bytes = buffer[start:end+2]
                buffer = buffer[end+2:]

                frame = bytes_to_frame(jpg_bytes)
                if frame is None:
                    continue

                annotated_frame, danger_status = model.annotate_frame(frame)
                output_bytes = frame_to_bytes(annotated_frame)

                with memory_lock:
                    shared_memory['frame'] = output_bytes
                    shared_memory['metadata'] = danger_status

    except Exception as e:
        print(f"[ERROR] Stream worker exception: {e}")
    finally:
        with memory_lock:
            shared_memory['frame'] = None

def get_or_create_stream(url, headers):
    incoming_auth = headers.get('Authorization', '')
    key = (url, incoming_auth)

    if key in active_streams:
        active_streams[key]['viewers'].value += 1
        return active_streams[key]['shared_memory'], active_streams[key]['memory_lock']

    try:
        r = requests.get(url, stream=True, headers=headers, timeout=5)
        if r.status_code == 401:
            print("[INFO] Authentication failed before starting stream.")
            r.close()
            return "AUTH_FAILED", None
        if r.status_code >= 400:
            print(f"[ERROR] Bad response from URL: {r.status_code}")
            r.close()
            return "URL_INVALID", None
        r.close()
    except Exception as e:
        print(f"[ERROR] Connection error: {e}")
        return "URL_INVALID", None

    shared_memory = manager.dict()
    memory_lock = manager.Lock()
    viewers = multiprocessing.Value('i', 1)

    process = multiprocessing.Process(target=stream_worker, args=(url, headers, shared_memory, memory_lock))
    process.daemon = True
    process.start()

    active_streams[key] = {
        'shared_memory': shared_memory,
        'memory_lock': memory_lock,
        'process': process,
        'viewers': viewers
    }

    return shared_memory, memory_lock

def decrease_viewer_count(url, headers):
    key = (url, headers.get('Authorization', ''))
    if key in active_streams:
        active_streams[key]['viewers'].value -= 1
        if active_streams[key]['viewers'].value <= 0:
            active_streams[key]['process'].terminate()
            active_streams[key]['process'].join()
            del active_streams[key]['viewers']
            del active_streams[key]['shared_memory']
            del active_streams[key]['memory_lock']
            del active_streams[key]
