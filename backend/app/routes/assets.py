from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.asset import Asset
from app.models.user import User, UserRole
from app.extensions import db
from app.services.cloudinary_service import upload_image
from app.utils.decorators import role_required

assets_bp = Blueprint("assets", __name__)

# ✅ Get all assets (Admin, Procurement, Finance see all; Employee sees only allocated)
@assets_bp.route("/", methods=["GET"])
@jwt_required()
def get_assets():
    user = User.query.get(get_jwt_identity())

    if user.role == UserRole.EMPLOYEE:
        assets = [alloc.asset for alloc in user.allocations]
    else:
        assets = Asset.query.all()

    return jsonify([
        {
            "id": a.id,
            "name": a.name,
            "image_url": a.image_url,
            "description": a.description,
            "brand": a.brand,
            "model_number": a.model_number,
            "serial_number": a.serial_number,
            "condition": a.condition,
            "status": a.status,
            "category_id": a.category_id
        } for a in assets
    ]), 200


# ✅ Get specific asset by ID
@assets_bp.route("/<int:asset_id>", methods=["GET"])
@jwt_required()
def get_asset(asset_id):
    asset = Asset.query.get(asset_id)
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    return jsonify({
        "id": asset.id,
        "name": asset.name,
        "image_url": asset.image_url,
        "description": asset.description,
        "brand": asset.brand,
        "model_number": asset.model_number,
        "serial_number": asset.serial_number,
        "condition": asset.condition,
        "status": asset.status,
        "category_id": asset.category_id
    }), 200


# ✅ Create asset (Admin & Procurement only)
@assets_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin", "Procurement")
def create_asset():
    data = request.form.to_dict()
    file = request.files.get("image")

    required_fields = ("name", "category_id")
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        image_url = upload_image(file) if file else None

        new_asset = Asset(
            name=data["name"],
            description=data.get("description"),
            image_url=image_url,
            brand=data.get("brand"),
            model_number=data.get("model_number"),
            serial_number=data.get("serial_number"),
            condition=data.get("condition"),
            category_id=int(data["category_id"]),
            created_by=get_jwt_identity()
        )

        db.session.add(new_asset)
        db.session.commit()
        return jsonify({"message": "Asset created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✅ Update asset (Admin & Procurement)
@assets_bp.route("/<int:asset_id>", methods=["PUT"])
@jwt_required()
@role_required("Admin", "Procurement")
def update_asset(asset_id):
    asset = Asset.query.get(asset_id)
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    data = request.json
    for field in [
        "name", "description", "brand", "model_number", "serial_number",
        "condition", "status", "category_id"
    ]:
        if field in data:
            setattr(asset, field, data[field])

    db.session.commit()
    return jsonify({"message": "Asset updated successfully"}), 200


# ✅ Delete asset (Admin & Procurement)
@assets_bp.route("/<int:asset_id>", methods=["DELETE"])
@jwt_required()
@role_required("Admin", "Procurement")
def delete_asset(asset_id):
    asset = Asset.query.get(asset_id)
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    db.session.delete(asset)
    db.session.commit()
    return jsonify({"message": "Asset deleted successfully"}), 200
