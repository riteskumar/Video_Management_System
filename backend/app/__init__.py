from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    from .api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    from .stream_manager import StreamManager
    app.stream_manager = StreamManager()

    return app