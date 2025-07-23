from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models import db

users_bp = Blueprint('users', __name__, url_prefix='/users')

# Utility: Convert user to dict (if method doesn't exist)
def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "created_at": user.created_at.isoformat()
    }

# GET /users - List users with pagination
@users_bp.route('', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = User.query.paginate(page=page, per_page=per_page, error_out=False)
    users = [user_to_dict(user) for user in pagination.items]

    return jsonify({
        "users": users,
        "page": page,
        "total_pages": pagination.pages,
        "total_items": pagination.total
    }), 200

# GET /users/<id> - Get single user
@users_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user_to_dict(user)), 200

# POST /users - Create a new user
@users_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not all(k in data for k in ['name', 'email', 'password', 'role']):
        return jsonify({"error": "Missing fields"}), 400

    new_user = User(
        name=data['name'],
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify(user_to_dict(new_user)), 201

# PUT /users/<id> - Update a user
@users_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)
    if 'password' in data:
        user.set_password(data['password'])

    db.session.commit()

    return jsonify(user_to_dict(user)), 200

# DELETE /users/<id> - Delete a user
@users_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
