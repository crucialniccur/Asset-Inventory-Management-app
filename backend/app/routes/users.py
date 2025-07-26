from flask import Blueprint, request, jsonify
from flasgger import swag_from
from app.models.user import User
from app.models import db

users_bp = Blueprint('users', __name__, url_prefix='/users')


def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "created_at": user.created_at.isoformat()
    }


@users_bp.route('', methods=['GET'])
@swag_from({
    'tags': ['Users'],
    'description': 'Get a list of users with pagination',
    'parameters': [
        {
            'name': 'page',
            'in': 'query',
            'type': 'integer',
            'default': 1,
            'description': 'Page number'
        },
        {
            'name': 'per_page',
            'in': 'query',
            'type': 'integer',
            'default': 10,
            'description': 'Number of items per page'
        }
    ],
    'responses': {
        200: {
            'description': 'List of users'
        }
    }
})
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    pagination = User.query.paginate(
        page=page, per_page=per_page, error_out=False)
    users = [user_to_dict(user) for user in pagination.items]

    return jsonify({
        "users": users,
        "page": page,
        "total_pages": pagination.pages,
        "total_items": pagination.total
    }), 200


@users_bp.route('/<int:id>', methods=['GET'])
@swag_from({
    'tags': ['Users'],
    'description': 'Get a single user by ID',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'User ID'
        }
    ],
    'responses': {
        200: {
            'description': 'User found'
        },
        404: {
            'description': 'User not found'
        }
    }
})
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user_to_dict(user)), 200


@users_bp.route('', methods=['POST'])
@swag_from({
    'tags': ['Users'],
    'description': 'Create a new user',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'email': {'type': 'string'},
                    'password': {'type': 'string'},
                    'role': {'type': 'string'}
                },
                'required': ['name', 'email', 'password', 'role']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'User created'
        },
        400: {
            'description': 'Missing fields or bad request'
        }
    }
})
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


@users_bp.route('/<int:id>', methods=['PUT'])
@swag_from({
    'tags': ['Users'],
    'description': 'Update an existing user',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        },
        {
            'name': 'body',
            'in': 'body',
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'email': {'type': 'string'},
                    'password': {'type': 'string'},
                    'role': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {'description': 'User updated'},
        404: {'description': 'User not found'}
    }
})
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


@users_bp.route('/<int:id>', methods=['DELETE'])
@swag_from({
    'tags': ['Users'],
    'description': 'Delete a user by ID',
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        }
    ],
    'responses': {
        200: {'description': 'User deleted'},
        404: {'description': 'User not found'}
    }
})
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
