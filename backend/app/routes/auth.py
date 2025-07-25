from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import db, User, UserRole
from app.decorators import role_required
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
# @jwt_required() # commented out for now
# @role_required('admin') # remove this a little bit i am testing.........
def register():
    """
    Register a new user...
    ---
    tags:
      - Authentication
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - username
              - email
              - password
            properties:
              username:
                type: string
              email:
                type: string
              password:
                type: string
    responses:
      201:
        description: User registered successfully
      400:
        description: Missing or invalid data
    """
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
    """
    Login a user
    ---
    tags:
      - Authentication
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - password
            properties:
              email:
                type: string
              password:
                type: string
    responses:
      200:
        description: Login successful, returns JWT token
      401:
        description: Invalid email or password
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    print(user.id)
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=1),
        additional_claims={'id': user.id, 'role': user.role.value, 'email': user.email})

    # {'id': user.id, 'role': user.role.value, 'email': user.email}
    # additional_claims={'id': user.id, 'role': user.role.value, 'email': user.email}
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))  # Cast string to int
    # user = User.query.get(identity)
    # user = User.query.get(identity['id']) i changed here too
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role.value,
        'created_at': user.created_at.isoformat()
    })


@auth_bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Auth route working!"})
