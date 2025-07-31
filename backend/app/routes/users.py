from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, UserRole
from app.extensions import db
from app.utils.decorators import role_required

users_bp = Blueprint("users", __name__)

# ✅ Get all users (Admin only)
@users_bp.route("/", methods=["GET"])
@jwt_required()
@role_required("Admin")
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# ✅ Get specific user
@users_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Users can view themselves, Admin can view all
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        return jsonify({"error": "Access denied"}), 403

    return jsonify(user.to_dict()), 200

# ✅ Create new user (Admin only)
@users_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin")
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing user data"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    try:
        new_user = User(
            name=data["name"],
            email=data["email"],
            department=data.get("department"),
            role=UserRole[data["role"].upper()]
        )
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Update user role/department/status
@users_bp.route("/<int:user_id>", methods=["PATCH"])
@jwt_required()
@role_required("Admin")
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    if "role" in data:
        try:
            user.role = UserRole[data["role"].upper()]
        except KeyError:
            return jsonify({"error": "Invalid role"}), 400

    if "department" in data:
        user.department = data["department"]

    if "is_active" in data:
        user.is_active = bool(data["is_active"])

    db.session.commit()
    return jsonify(user.to_dict()), 200

# ✅ Deactivate/suspend user
@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required("Admin")
def suspend_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_active = False
    db.session.commit()
    return jsonify({"message": f"User {user.email} suspended."}), 200
