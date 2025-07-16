from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

manager_bp = Blueprint('manager_bp', __name__, url_prefix="/api/manager")

@manager_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify(message="Manager controller active"), 200

@manager_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify(message=f"Hello {user['role']} with ID {user['id']}!"), 200

@manager_bp.route("/assets", methods=["GET"])
@jwt_required()
def get_assets():
    assets = [
        {"id": 1, "name": "Laptop", "category": "Electronics", "assigned_to": "John Doe"},
        {"id": 2, "name": "Chair", "category": "Furniture", "assigned_to": "Jane Smith"},
    ]
    return jsonify(assets=assets), 200
