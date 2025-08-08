from flask import jsonify, request, current_app
from . import bp
from ..stream_manager import StreamSource

@bp.route('/streams', methods=['GET'])
def get_streams():
    """Get all active streams"""
    streams = current_app.stream_manager.get_all_streams()
    return jsonify({
        'count': len(streams),
        'streams': [stream.to_dict() for stream in streams]
    })

@bp.route('/streams', methods=['POST'])
def add_stream():
    """Add a new stream"""
    data = request.json

    if not data or 'source' not in data:
        return jsonify({'error': 'Missing source parameter'}), 400

    source = data['source']
    name = data.get('name', f"Stream-{len(current_app.stream_manager.get_all_streams()) + 1}")
    models = data.get('models', [])

    #TODO
    if source.isdigit():
        source_type = StreamSource.CAMERA
    elif any(source.endswith(ext) for ext in ['.mp4', '.avi', '.mov']):
        source_type = StreamSource.VIDEO_FILE
    else:
        source_type = StreamSource.IMAGE_FOLDER

    stream_id = current_app.stream_manager.add_stream(
        source=source,
        source_type=source_type,
        name=name,
        models=models
    )

    return jsonify({'id': stream_id, 'message': 'Stream added successfully'}), 201

@bp.route('/streams/<stream_id>', methods=['DELETE'])
def remove_stream(stream_id):
    """Remove a stream"""
    success = current_app.stream_manager.remove_stream(stream_id)
    if success:
        return jsonify({'message': 'Stream removed successfully'})
    return jsonify({'error': 'Stream not found'}), 404

@bp.route('/streams/<stream_id>/models', methods=['POST'])
def add_model_to_stream(stream_id):
    """Add a model to a stream"""
    data = request.json

    if not data or 'model' not in data:
        return jsonify({'error': 'Missing model parameter'}), 400

    model_name = data['model']
    success = current_app.stream_manager.add_model_to_stream(stream_id, model_name)

    if success:
        return jsonify({'message': f'Model {model_name} added to stream {stream_id}'})
    return jsonify({'error': 'Stream not found or model already added'}), 404

@bp.route('/streams/<stream_id>/models/<model_name>', methods=['DELETE'])
def remove_model_from_stream(stream_id, model_name):
    """Remove a model from a stream"""
    success = current_app.stream_manager.remove_model_from_stream(stream_id, model_name)

    if success:
        return jsonify({'message': f'Model {model_name} removed from stream {stream_id}'})
    return jsonify({'error': 'Stream or model not found'}), 404

@bp.route('/results/<stream_id>', methods=['GET'])
def get_results(stream_id):
    """Get results for a specific stream"""
    results = current_app.stream_manager.get_results(stream_id)

    if results:
        return jsonify(results)
    return jsonify({'error': 'No results found for this stream'}), 404

@bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Get all alerts"""
    alerts = current_app.stream_manager.get_alerts()
    return jsonify({
        'count': len(alerts),
        'alerts': alerts
    })