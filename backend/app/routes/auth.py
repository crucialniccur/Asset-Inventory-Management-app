from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.extensions import db
from app.models.user import User, UserRole
from app.services.mailgun_service import send_email
from app.services.twofa_service import generate_2fa_code, validate_2fa_code
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
import jwt as pyjwt
import datetime
import os
import traceback

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/me", methods=["GET"])
@cross_origin()
@jwt_required()
def get_current_user():
    """Get current authenticated user profile"""
    try:
        user_id = get_jwt_identity()
        print(f"🔍 Getting user profile for ID: {user_id}")

        user = User.query.get(user_id)

        if not user:
            print(f"❌ User not found with ID: {user_id}")
            return jsonify({"error": "User not found"}), 404

        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value,
            "department": user.department,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }

        print(f"✅ User profile retrieved: {user.email}")
        return jsonify(user_data), 200

    except Exception as e:
        print(f"❌ Get current user error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route("/register", methods=["POST"])
@cross_origin()
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "email", "password", "role"]
        if not data or not all(k in data for k in required_fields):
            return jsonify({"error": "Missing required fields: name, email, password, role"}), 400

        # Check if email already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already in use. Please use a different email address."}), 409

        # Admin registration restriction (allow if no admins or if it's the first user)
        if data["role"].upper() == "ADMIN":
            existing_admins = User.query.filter_by(role=UserRole.ADMIN).count()
            total_users = User.query.count()
            if existing_admins > 0 and total_users > 1:
                return jsonify({"error": "Admin registration is restricted. Please register as a different role or contact an existing admin."}), 403

        # Validate role
        try:
            role = UserRole[data["role"].upper()]
        except KeyError:
            valid_roles = [role.value for role in UserRole]
            return jsonify({"error": f"Invalid user role. Valid roles: {valid_roles}"}), 400

        # Create new user
        new_user = User()
        new_user.name = data["name"]
        new_user.email = data["email"]
        new_user.role = role
        new_user.department = data.get("department")
        new_user.set_password(data["password"])

        db.session.add(new_user)
        db.session.commit()

        print(f"✅ User registered successfully: {new_user.email}")
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role.value,
                "department": new_user.department
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Registration error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    """Authenticate user and send 2FA code"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or not all(k in data for k in ("email", "password")):
            return jsonify({"error": "Missing email or password"}), 400

        print(f"🔍 Login attempt for: {data.get('email')}")

        # Find user
        user = User.query.filter_by(email=data["email"]).first()
        if not user:
            print(f"❌ User not found: {data.get('email')}")
            return jsonify({"error": "Invalid email or password"}), 401

        # Verify password
        if not user.check_password(data["password"]):
            print(f"❌ Invalid password for: {data.get('email')}")
            return jsonify({"error": "Invalid email or password"}), 401

        print(f"✅ Password verified for: {user.email}")

        # Generate and send 2FA code
        try:
            code = generate_2fa_code(user.id)
            print(f"🔐 Generated 2FA code for user {user.id}: {code}")

            # Send email with 2FA code
            email_subject = "Your Asset Manager 2FA Code"
            email_body = f"""
            Hello {user.name},

            Your verification code for Asset Manager is: {code}

            This code will expire in 10 minutes.

            If you didn't request this code, please ignore this email.

            Best regards,
            Asset Manager Team
            """

            send_email(user.email, email_subject, email_body)
            print(f"📧 2FA code sent to: {user.email}")

        except Exception as email_error:
            print(f"❌ Failed to send 2FA email: {str(email_error)}")
            return jsonify({"error": "Failed to send verification code"}), 500

        return jsonify({
            "message": "2FA code sent to email",
            "user_id": user.id,
            "requires2FA": True
        }), 200

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route("/verify-2fa", methods=["POST"])
@cross_origin()
def verify_2fa():
    """Verify 2FA code and return JWT token"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or not all(k in data for k in ("user_id", "code")):
            return jsonify({"error": "Missing user_id or code"}), 400

        user_id = data["user_id"]
        code = data["code"]

        print(f"🔐 Verifying 2FA code for user {user_id}: {code}")

        # Validate 2FA code
        if not validate_2fa_code(user_id, code):
            print(f"❌ Invalid 2FA code for user {user_id}")
            return jsonify({"error": "Invalid or expired 2FA code"}), 401

        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User not found during 2FA verification: {user_id}")
            return jsonify({"error": "User not found"}), 404

        # Create JWT token
        identity = str(user_id)  # Ensure it's a string
        token = create_access_token(
            identity=identity,
            expires_delta=datetime.timedelta(hours=24)  # Token expires in 24 hours
        )

        print(f"✅ 2FA verification successful for user: {user.email}")
        return jsonify({"token": token}), 200

    except Exception as e:
        print(f"❌ 2FA verification error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

""" @auth_bp.route("/request-reset", methods=["POST"])
@cross_origin()
def request_reset():

    try:
        data = request.get_json()

        if not data or not data.get("email"):
            return jsonify({"error": "Email is required"}), 400

        email = data.get("email")
        user = User.query.filter_by(email=email).first()

        if not user:
            print(f"❌ Password reset requested for non-existent user: {email}")
            # Don't reveal if user exists or not for security
            return jsonify({"message": "If an account with this email exists, a password reset link has been sent"}), 200

        # Create reset token
        token_data = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }

        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            print("❌ SECRET_KEY not found in environment")
            return jsonify({"error": "Server configuration error"}), 500

        token = pyjwt.encode(token_data, secret_key, algorithm="HS256")

        # Construct reset link
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/reset-password?token={token}"

        # Send email
        email_subject = "Reset Your Asset Manager Password" """
