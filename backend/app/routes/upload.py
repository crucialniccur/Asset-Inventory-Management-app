from flask import Blueprint, request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required
from app.decorators import role_required

upload_bp = Blueprint('upload', __name__, url_prefix='/upload')


@upload_bp.route('/image', methods=['POST'])
@jwt_required()
# @role_required("Employee")  # or remove this to test freely
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        result = cloudinary.uploader.upload(file)
        return jsonify({"url": result['secure_url']}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
