from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import db, User, UserRole
from app.utils.decorators import role_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@jwt_required()
@role_required('admin')
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'employee')

    if not all([name, email, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(name=name, email=email, role=UserRole[role.lower()])
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'role': user.role.value, 'email': user.email})
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role.value,
        'created_at': user.created_at.isoformat()
    })
