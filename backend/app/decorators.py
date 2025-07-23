from functools import wraps
from flask import request, jsonify, g
from app.models.user import User
import jwt
from app.config import Config

from app.models import db
SECRET_KEY = Config.SECRET_KEY

def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            if not token:
                return jsonify({"message": "Token is missing"}), 401
            
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user = db.session.get(User, payload['user_id'])
                if not user or user.role.value not in roles:
                    return jsonify({"message": "Access forbidden"}), 403
            
            except jwt.ExpiredSignatureError:
                return {"message": "Token expired"}, 401
            except jwt.InvalidTokenError:
                return {"message": "Invalid token"}, 401

            return fn(*args, **kwargs)            
        return wrapper
    return decorator