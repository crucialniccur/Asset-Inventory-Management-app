from functools import wraps
from flask import request, jsonify, g
from app.models.user import User
import jwt
from app.config import Config
from flask_jwt_extended import decode_token

from app.models import db
SECRET_KEY = Config.SECRET_KEY


def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization", None)

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            else:
                return jsonify({"message": "Token is missing or malformed"}), 401

            try:
                # jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                payload = decode_token(token)
                # print(payload)
                user_info = payload['sub']
                user = db.session.get(User, int(payload['sub']))

                if not user or user.role.value.lower() not in [r.lower() for r in roles]:
                    print(
                        f"!!!! Access denied for user {user.email} with role '{user.role.value}'")
                    return jsonify({"message": "Access forbidden"}), 403

            except jwt.ExpiredSignatureError:
                return {"message": "Token expired"}, 401
            except jwt.InvalidTokenError:
                return {"message": "Invalid token"}, 401

            return fn(*args, **kwargs)
        return wrapper
    return decorator
# Decorators documentation
