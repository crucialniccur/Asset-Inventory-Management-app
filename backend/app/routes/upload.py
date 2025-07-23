from flask import Blueprint, request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required
from app.decorators import role_required
import imghdr

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

upload_bp = Blueprint('upload', __name__, url_prefix='/upload')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/image', methods=['POST'])
@jwt_required()
# @role_required("Employee")  # Uncomment this when you're ready to enforce roles
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Additional image verification (not just by extension)
    file.stream.seek(0)
    kind = imghdr.what(file)
    if kind not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Uploaded file is not a valid image"}), 400
    file.stream.seek(0)  # Reset stream for actual upload

    try:
        result = cloudinary.uploader.upload(
            file,
            folder="asset_images"  # Optional: Change as needed
        )
        return jsonify({"url": result['secure_url']}), 201
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
