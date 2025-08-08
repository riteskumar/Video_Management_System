from app import create_app
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description='Video Management System Server')
    parser.add_argument('--host', default='0.0.0.0', help='Host to run the server on')
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    parser.add_argument('--debug', action='store_true', help='Run in debug mode')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    app = create_app()
    app.run(host=args.host, port=args.port, debug=args.debug)
else:
    app = create_app()