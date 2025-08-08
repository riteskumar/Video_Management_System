import uuid
import threading
import time
import os
import cv2
import numpy as np
from enum import Enum
from pathlib import Path
from datetime import datetime
from flask import current_app

class StreamSource(Enum):
    CAMERA = 'camera'
    VIDEO_FILE = 'video_file'
    IMAGE_FOLDER = 'image_folder'

class Stream:
    def __init__(self, id, source, source_type, name=None, models=None):
        self.id = id
        self.source = source
        self.source_type = source_type
        self.name = name or f"Stream-{id[:8]}"
        self.models = models or []
        self.active = False
        self.thread = None
        self.last_frame = None
        self.results = {}
        self.alerts = []
        self.start_time = None
        self.frame_count = 0


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'source': self.source,
            'source_type': self.source_type.value,
            'models': self.models,
            'active': self.active,
            'frame_count': self.frame_count,
            'uptime': (datetime.now() - self.start_time).total_seconds() if self.start_time else 0
        }

    def start(self):
        if self.active:
            return False

        self.active = True
        self.start_time = datetime.now()
        self.thread = threading.Thread(target=self._process_stream)
        self.thread.daemon = True
        self.thread.start()
        return True

    def stop(self):
        if not self.active:
            return False

        self.active = False
        if self.thread:
            self.thread.join(timeout=1.0)
            self.thread = None
        return True

    def _process_stream(self):
        if self.source_type == StreamSource.CAMERA:
            self._process_camera()
        elif self.source_type == StreamSource.VIDEO_FILE:
            self._process_video_file()
        elif self.source_type == StreamSource.IMAGE_FOLDER:
            self._process_image_folder()

    def _process_camera(self):
        cap = cv2.VideoCapture(int(self.source))
        if not cap.isOpened():
            self.active = False
            self.alerts.append({
                'timestamp': datetime.now().isoformat(),
                'level': 'error',
                'message': f"Failed to open camera {self.source}"
            })
            return

        self._process_video_capture(cap)

    def _process_video_file(self):
        cap = cv2.VideoCapture(self.source)
        if not cap.isOpened():
            self.active = False
            self.alerts.append({
                'timestamp': datetime.now().isoformat(),
                'level': 'error',
                'message': f"Failed to open video file {self.source}"
            })
            return

        self._process_video_capture(cap)

    def _process_video_capture(self, cap):
        start_time = time.time()
        frame_count = 0

        while self.active:
            ret, frame = cap.read()
            if not ret:

                if self.source_type == StreamSource.VIDEO_FILE:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                else:
                    break

            self.last_frame = frame
            self.frame_count += 1
            frame_count += 1


            self._run_inference(frame)
            time.sleep(0.01)

        cap.release()

    def _process_image_folder(self):
        folder_path = Path(self.source)
        if not folder_path.exists() or not folder_path.is_dir():
            self.active = False
            self.alerts.append({
                'timestamp': datetime.now().isoformat(),
                'level': 'error',
                'message': f"Invalid image folder path: {self.source}"
            })
            return

        image_files = [f for f in folder_path.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp']]
        if not image_files:
            self.active = False
            self.alerts.append({
                'timestamp': datetime.now().isoformat(),
                'level': 'error',
                'message': f"No image files found in folder: {self.source}"
            })
            return

        frame_count = 0

        while self.active:
            for img_path in image_files:
                if not self.active:
                    break

                frame = cv2.imread(str(img_path))
                if frame is None:
                    continue

                self.last_frame = frame
                self.frame_count += 1
                frame_count += 1

                self._run_inference(frame)

                time.sleep(0.5)



class StreamManager:
    def __init__(self):
        self.streams = {}
        self.lock = threading.Lock()

    def add_stream(self, source, source_type, name=None, models=None):
        with self.lock:
            stream_id = str(uuid.uuid4())
            stream = Stream(
                id=stream_id,
                source=source,
                source_type=source_type,
                name=name,
                models=models
            )
            self.streams[stream_id] = stream
            stream.start()
            return stream_id

    def remove_stream(self, stream_id):
        with self.lock:
            if stream_id not in self.streams:
                return False

            stream = self.streams[stream_id]
            stream.stop()
            del self.streams[stream_id]
            return True

    def get_stream(self, stream_id):
        return self.streams.get(stream_id)

    def get_all_streams(self):
        return list(self.streams.values())

    def add_model_to_stream(self, stream_id, model_name):
        stream = self.get_stream(stream_id)
        if not stream or model_name in stream.models:
            return False

        stream.models.append(model_name)
        return True

    def remove_model_from_stream(self, stream_id, model_name):
        stream = self.get_stream(stream_id)
        if not stream or model_name not in stream.models:
            return False

        stream.models.remove(model_name)
        return True

    def get_results(self, stream_id):
        stream = self.get_stream(stream_id)
        if not stream:
            return None

        return stream.results

    def get_alerts(self):
        all_alerts = []
        for stream in self.streams.values():
            all_alerts.extend(stream.alerts)

        return all_alerts