from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
import cloudinary.uploader
import os

upload_bp = Blueprint('upload', __name__, url_prefix='/upload')


@upload_bp.route('/image', methods=['POST'])
@jwt_required()
@swag_from({
    'tags': ['Image Upload'],
    'summary': 'Upload an image to Cloudinary',
    'description': 'Uploads an image file to Cloudinary. Requires a JWT token.',
    'consumes': ['multipart/form-data'],
    'parameters': [
        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'Image file to upload'
        },
        {
            'name': 'Authorization',
            'in': 'header',
            'type': 'string',
            'required': True,
            'description': 'Bearer JWT token'
        }
    ],
    'responses': {
        201: {
            'description': 'Upload successful',
            'examples': {
                'application/json': {
                    'message': 'Upload successful',
                    'image_url': 'https://res.cloudinary.com/your-cloud-name/image/upload/sample.jpg'
                }
            }
        },
        400: {
            'description': 'No file provided or bad request'
        },
        500: {
            'description': 'Upload failed'
        }
    }
})
def upload_image():
    user_id = get_jwt_identity()

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Optional: Add user_id to folder path if needed
        upload_result = cloudinary.uploader.upload(
            file,
            folder=f"user_{user_id}/uploads"
        )
        image_url = upload_result.get('secure_url')
        return jsonify({'message': 'Upload successful', 'image_url': image_url}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
