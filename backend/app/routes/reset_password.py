from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import create_access_token, decode_token
from app.services.mailgun_service import send_email
from datetime import timedelta

reset_bp = Blueprint("reset", __name__)

@reset_bp.route("/request-reset", methods=["POST"])
def request_password_reset():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        # Security: Don't reveal if email exists
        return jsonify({"message": "If the email exists, a reset link will be sent."}), 200

    # Create reset token with limited purpose
    reset_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(minutes=30),
        additional_claims={"purpose": "reset"}
    )

    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    message = f"""Hello {user.name},

Click the link below to reset your password:

{reset_link}

This link will expire in 30 minutes.
"""

    send_email(user.email, "Password Reset", message)

    return jsonify({"message": "If the email exists, a reset link will be sent."}), 200


@reset_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")  # ✅ Must match frontend key

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    try:
        decoded = decode_token(token)

        if decoded.get("purpose") != "reset":
            return jsonify({"error": "Invalid token purpose"}), 400

        user_id = decoded.get("sub")
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404
        
        print(f"🔐 New password received: {new_password}")

        user.set_password(new_password)
        db.session.commit()

        return jsonify({"message": "Password has been reset successfully."}), 200

    except Exception as e:
        print(f"❌ Reset error: {str(e)}")
        return jsonify({"error": "Invalid or expired token"}), 400


