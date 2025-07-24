from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.asset import db, Asset
from cloudinary.uploader import upload
import cloudinary

assets_bp = Blueprint('assets', __name__, url_prefix='/assets')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@assets_bp.route('/', methods=['POST'])
@jwt_required()
def create_asset():
    data = request.form
    name = data.get('name')
    description = data.get('description')
    quantity = int(data.get('quantity'))
    category_id = int(data.get('category_id'))

    file = request.files.get('image')
    image_url = None

    if file and allowed_file(file.filename):
        result = upload(file, folder="asset_images")
        image_url = result.get('secure_url')

    new_asset = Asset(
        name=name,
        description=description,
        quantity=quantity,
        category_id=category_id,
        image=image_url
    )

    db.session.add(new_asset)
    db.session.commit()

    return jsonify(new_asset.to_dict()), 201


@assets_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_asset(id):
    asset = Asset.query.get_or_404(id)
    data = request.form

    asset.name = data.get('name', asset.name)
    asset.description = data.get('description', asset.description)
    asset.quantity = int(data.get('quantity', asset.quantity))
    asset.category_id = int(data.get('category_id', asset.category_id))

    file = request.files.get('image')
    if file and allowed_file(file.filename):
        result = upload(file, folder="asset_images")
        asset.image = result.get('secure_url', asset.image)

    db.session.commit()
    return jsonify(asset.to_dict()), 200


@assets_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_asset(id):
    asset = Asset.query.get_or_404(id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({"message": "Asset deleted"}), 200
