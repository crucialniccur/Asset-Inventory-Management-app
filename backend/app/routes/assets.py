from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.decorators import role_required
from app.models.asset import db, Asset
from flasgger.utils import swag_from

assets_bp = Blueprint('assets', __name__, url_prefix='/assets')


@assets_bp.route('/', methods=['GET'])
@swag_from({
    "tags": ["Assets"],
    "description": "Get all assets",
    "responses": {
        200: {
            "description": "A list of assets"
        }
    }
})
@jwt_required()
@role_required('Admin')
def get_assets():
    assets = Asset.query.all()
    return jsonify([asset.to_dict() for asset in assets]), 200


@assets_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
@role_required('Admin')
def get_asset(id):
    asset = Asset.query.get_or_404(id)
    return jsonify(asset.to_dict()), 200


@assets_bp.route('/', methods=['POST'])
@swag_from({
    "tags": ["Assets"],
    "description": "Create a new asset record.",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "description": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "category_id": {"type": "integer"},
                    "image_url": {"type": "string"}
                },
                "required": ["name", "category_id"]
            }
        }
    ],
    "responses": {
        201: {
            "description": "Asset created successfully"
        },
        400: {
            "description": "Missing required fields"
        }
    }
})
@jwt_required()
@role_required('Admin')
def create_asset():
    data = request.get_json()

    name = data.get('name')
    description = data.get('description', '')
    quantity = data.get('quantity', 1)
    category_id = data.get('category_id')
    image_url = data.get('image_url', None)

    if not name or not category_id:
        return jsonify({"error": "Missing required fields: name and category_id"}), 400

    new_asset = Asset(
        name=name,
        description=description,
        quantity=quantity,
        category_id=category_id,
        image_url=image_url,
    )

    db.session.add(new_asset)
    db.session.commit()

    return jsonify(new_asset.to_dict()), 201


@assets_bp.route('/<int:id>', methods=['PATCH'])
@swag_from({
    "tags": ["Assets"],
    "description": "Update an existing asset by ID.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "Asset ID"
        },
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "description": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "category_id": {"type": "integer"},
                    "image_url": {"type": "string"}
                }
            }
        }
    ],
    "responses": {
        200: {
            "description": "Asset updated successfully"
        },
        404: {
            "description": "Asset not found"
        }
    }
})
@jwt_required()
@role_required('Admin')
def update_asset(id):
    asset = Asset.query.get_or_404(id)
    data = request.get_json()

    asset.name = data.get('name', asset.name)
    asset.description = data.get('description', asset.description)
    asset.quantity = data.get('quantity', asset.quantity)
    asset.category_id = data.get('category_id', asset.category_id)
    asset.image_url = data.get('image_url', asset.image_url)

    db.session.commit()
    return jsonify(asset.to_dict()), 200


@assets_bp.route('/<int:id>', methods=['DELETE'])
@swag_from({
    "tags": ["Assets"],
    "description": "Delete an asset by ID.",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "type": "integer",
            "required": True,
            "description": "Asset ID"
        }
    ],
    "responses": {
        200: {
            "description": "Asset deleted successfully"
        },
        404: {
            "description": "Asset not found"
        }
    }
})
@jwt_required()
@role_required('Admin')
def delete_asset(id):
    asset = Asset.query.get_or_404(id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({"message": "Asset deleted"}), 200
