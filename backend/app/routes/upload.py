from flask import Blueprint, request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.decorators import role_required
from app.models.asset import db, Asset  # assuming you're saving into Asset
import imghdr

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

upload_bp = Blueprint('upload', __name__, url_prefix='/upload')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/image', methods=['POST'])
@jwt_required()
# @role_required("Employee")
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    file.stream.seek(0)
    kind = imghdr.what(file)
    if kind not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Uploaded file is not a valid image"}), 400
    file.stream.seek(0)

    try:
        result = cloudinary.uploader.upload(
            file,
            folder="asset_images"
        )

        image_url = result['secure_url']

        # Save to DB - either create a new Asset or update existing one
        new_asset = Asset(image_url=image_url)  # update based on your model
        db.session.add(new_asset)
        db.session.commit()

        return jsonify({
            "message": "Upload successful",
            "url": image_url,
            "asset_id": new_asset.id  # Just in case you want to reference it
        }), 201

    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
