from functools import wraps
from flask import request, jsonify, g
from app.models import User
import jwt
from app.utils import SECRET_KEY

def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth = request.headers.get("Authorization", "")
            token = auth.split(" ")[1] if " " in auth else auth
            if not token:
                return {"message": "Missing token"}, 401
            
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user = User.query.get(payload["user_id"])

                if not user:
                    return  {"message": "User not found"}, 404
                
                if not user.has_role(*allowed_roles):
                    return {"message": "Forbidden: insufficient permissions"}, 403
                
                g.current_user = user
                return fn(*args, **kwargs)
            
            except jwt.ExpiredSignatureError:
                return {"message": "Token expired"}, 401
            except jwt.InvalidTokenError:
                return {"message": "Invalid token"}, 401
            
        return wrapper
    return decorator