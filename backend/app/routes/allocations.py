from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.allocation import Allocation
from app.models.asset import Asset
from app.models.user import User, UserRole
from app.extensions import db
from app.utils.decorators import role_required
from datetime import datetime

allocations_bp = Blueprint("allocations", __name__)

# ✅ Assign asset to user (Admin/Procurement)
@allocations_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin", "Procurement")
def allocate_asset():
    data = request.json
    user_id = data.get("user_id")
    asset_id = data.get("asset_id")

    if not all([user_id, asset_id]):
        return jsonify({"error": "user_id and asset_id are required"}), 400

    if not User.query.get(user_id):
        return jsonify({"error": "User not found"}), 404
    if not Asset.query.get(asset_id):
        return jsonify({"error": "Asset not found"}), 404

    allocation = Allocation(asset_id=asset_id, user_id=user_id)
    db.session.add(allocation)
    db.session.commit()

    return jsonify({"message": "Asset allocated"}), 201

# ✅ View all allocations (Admin/Procurement)
@allocations_bp.route("/", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement")
def get_allocations():
    allocations = Allocation.query.all()
    return jsonify([{
        "id": a.id,
        "asset_id": a.asset_id,
        "user_id": a.user_id,
        "allocated_at": a.allocated_at.isoformat()
    } for a in allocations]), 200

# ✅ View own allocations (Employee)
@allocations_bp.route("/my", methods=["GET"])
@jwt_required()
@role_required("Employee")
def get_my_allocations():
    user_id = get_jwt_identity()
    allocations = Allocation.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": a.id,
        "asset_id": a.asset_id,
        "allocated_at": a.allocated_at.isoformat()
    } for a in allocations]), 200
