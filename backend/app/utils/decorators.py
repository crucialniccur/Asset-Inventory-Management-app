from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models.user import User, UserRole

def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user = User.query.get(get_jwt_identity())
            if not user or user.role.value not in roles:
                return jsonify({"error": "Access denied"}), 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper
