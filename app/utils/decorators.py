from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models.user import User

def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user = User.query.get(get_jwt_identity())

            if not user:
                return jsonify({"error": "User not found"}), 404

            user_role = user.role.value.lower()  # Normalize user role to lowercase
            allowed_roles = [role.lower() for role in roles]  # Normalize accepted roles

            if user_role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403

            return fn(*args, **kwargs)
        return decorated
    return wrapper
