import threading
import requests
from flask import Flask, Response, request, stream_with_context
from flask_cors import cross_origin
from stream_handler import get_or_create_stream, decrease_viewer_count

lock = threading.Lock()
app = Flask(__name__)


@app.route('/check_camera', methods=['GET'])
@cross_origin()
def test_camera_connection():
    url = request.args.get('url')
    if not url:
        return Response("Missing 'url' parameter", 400)

    auth_header = request.headers.get('Authorization')
    headers = {'Authorization': auth_header} if auth_header else {}

    try:
        response = requests.get(url, headers=headers, stream=True, timeout=5)

        status_code = response.status_code
        response.close()

        if status_code == 401:
            return Response(
                'Authentication failed',
                401,
                {'WWW-Authenticate': 'Basic realm="Camera Access"'}
            )
        elif status_code >= 400:
            return Response(
                f'Connection failed with status code {status_code}',
                400
            )
        return Response("Connection successful", 200)
    except requests.exceptions.RequestException as e:
        return Response(f"Connection error: {str(e)}", 400)


@app.route('/stream')
@cross_origin()
def stream():
    stream_url = request.args.get('url')
    if not stream_url:
        return Response("Missing 'url' parameter", 400)

    auth_header = request.headers.get('Authorization')
    headers = {'Authorization': auth_header} if auth_header else {}

    with lock:
        shared_memory, memory_lock = get_or_create_stream(stream_url, headers)

    if shared_memory == "AUTH_FAILED":
        return Response(
            'Authentication required',
            401,
            {'WWW-Authenticate': 'Basic realm="Camera Access"'}
        )
    if shared_memory == "URL_INVALID":
        return Response(
            'Invalid URL or cannot connect to camera.',
            400
        )

    def generate():
        try:
            while True:
                with memory_lock:
                    frame_data = shared_memory.get('frame')
                    metadata = shared_memory.get('metadata', 'unknown')

                if frame_data is not None:
                    yield (
                        b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n'
                        + f'Metadata: {metadata}\r\n'.encode()
                        + b'\r\n'
                        + frame_data
                        + b'\r\n'
                    )
        finally:
            with lock:
                decrease_viewer_count(stream_url, headers)

    return Response(stream_with_context(generate()), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)