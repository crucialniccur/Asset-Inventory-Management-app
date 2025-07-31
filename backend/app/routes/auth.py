from flask import Blueprint, request, jsonify
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

auth_bp = Blueprint("auth", __name__)

# ✅ Public admin registration (for initial setup only)
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        if not all(k in data for k in ("name", "email", "password", "role")):
            return jsonify({"error": "Missing fields"}), 400

        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already in use"}), 409

        if data["role"].upper() == "ADMIN":
            existing_admins = User.query.filter_by(role=UserRole.ADMIN).count()
            if existing_admins > 0:
                return jsonify({"error": "Registration locked to Admins only"}), 403

        try:
            role = UserRole[data["role"].upper()]
        except KeyError:
            return jsonify({"error": "Invalid user role"}), 400

        new_user = User(
            name=data["name"],
            email=data["email"],
            role=role,
            department=data.get("department")
        )
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        import traceback
        print("❌ Exception in /register:", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500



# ✅ Login and send 2FA code
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not all(k in data for k in ("email", "password")):
            return jsonify({"error": "Missing credentials"}), 400

        user = User.query.filter_by(email=data["email"]).first()
        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate 2FA code
        code = generate_2fa_code(user.id)
        send_email(user.email, "Your 2FA Code", f"Your verification code is: {code}")

        return jsonify({"message": "2FA code sent to email", "user_id": user.id}), 200

    except Exception as e:
        print("❌ Login error:", e)
        return jsonify({"error": "Internal server error"}), 500


# ✅ Verify 2FA and issue JWT token
@auth_bp.route("/verify-2fa", methods=["POST"])
def verify_2fa():
    try:
        data = request.get_json()
        if not all(k in data for k in ("user_id", "code")):
            return jsonify({"error": "Missing data"}), 400

        if validate_2fa_code(data["user_id"], data["code"]):
            identity = str(data["user_id"])  # Ensure it's a string
            token = create_access_token(identity=identity)
            return jsonify({"token": token}), 200
        else:
            return jsonify({"error": "Invalid or expired 2FA code"}), 401

    except Exception as e:
        print("❌ 2FA verification error:", e)
        return jsonify({"error": "Internal server error"}), 500


# ✅ Send password reset link
@auth_bp.route("/request-reset", methods=["POST"])
def request_reset():
    try:
        data = request.json
        user = User.query.filter_by(email=data.get("email")).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        token_data = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }
        token = pyjwt.encode(token_data, os.getenv("SECRET_KEY"), algorithm="HS256")
        reset_link = f"http://localhost:5173/reset-password?token={token}"

        send_email(user.email, "Reset Your Password", f"Click here to reset your password: {reset_link}")
        return jsonify({"message": "Password reset email sent"}), 200

    except Exception as e:
        print("❌ Password reset error:", e)
        return jsonify({"error": "Internal server error"}), 500


# ✅ Reset password using token
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.json
        token = data.get("token")
        new_password = data.get("password")

        payload = pyjwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user = User.query.get(payload["user_id"])
        if not user:
            return jsonify({"error": "Invalid user"}), 404

        user.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200

    except pyjwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print("❌ Reset error:", e)
        return jsonify({"error": "Internal server error"}), 500
