from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User, UserRole
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

dev_bp = Blueprint("dev", __name__)

@dev_bp.route("/create-user", methods=["POST"])
def create_user():
    """Create a user for testing (development only)"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or not all(k in data for k in ("name", "email", "password", "role")):
            return jsonify({"error": "Missing required fields: name, email, password, role"}), 400

        # Check if email already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already in use"}), 409

        # Validate role
        try:
            role = UserRole[data["role"].upper()]
        except KeyError:
            valid_roles = [role.value for role in UserRole]
            return jsonify({"error": f"Invalid user role. Valid roles: {valid_roles}"}), 400

        # Create new user
        user = User()
        user.name = data["name"]
        user.email = data["email"]
        user.role = role
        user.department = data.get("department", "IT")
        user.password_hash = generate_password_hash(data["password"])

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value,
                "department": user.department
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@dev_bp.route("/login-simple", methods=["POST"])
def login_simple():
    """Simple login without 2FA (development only)"""
    try:
        data = request.get_json()

        if not data or not all(k in data for k in ("email", "password")):
            return jsonify({"error": "Missing email or password"}), 400

        # Find user
        user = User.query.filter_by(email=data["email"]).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Verify password
        if not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Create JWT token directly (no 2FA)
        token = create_access_token(
            identity=str(user.id),
            expires_delta=datetime.timedelta(hours=24)
        )

        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value,
                "department": user.department
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
