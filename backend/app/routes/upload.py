from flask import Blueprint, request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required
import imghdr

upload_bp = Blueprint('upload', __name__, url_prefix='/upload')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Check if it's a real image
    file.stream.seek(0)
    kind = imghdr.what(file)
    if kind not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Uploaded file is not a valid image"}), 400
    file.stream.seek(0)

    try:
        result = cloudinary.uploader.upload(file, folder="asset_images")
        image_url = result.get('secure_url')

        return jsonify({
            "message": "Upload successful",
            "image_url": image_url
        }), 201

    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
