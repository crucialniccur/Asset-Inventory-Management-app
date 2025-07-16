from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models.user import User
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

# ✅ Set correct URL prefix
auth_bp = Blueprint("auth_bp", __name__, url_prefix="/api/auth")

# ✅ Register route
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "employee")  # default role

    if not username or not email or not password:
        return jsonify(message="Missing required fields"), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify(message="Username or email already exists"), 400

    user = User(username=username, email=email, role=role)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(message="User creation failed. Possible duplicate."), 500

    return jsonify(message="User registered successfully"), 201

# ✅ Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify(message="Username and password required"), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify(message="Invalid credentials"), 401

    token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify(token=token, role=user.role, message="Login successful"), 200
