from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.request import Request
from app.decorators import role_required

from models import db

employee_bp = Blueprint('employee', __name__, url_prefix='/employee')

@employee_bp.route('/my-requests', method=['GET'])
@jwt_required()
@role_required("Employee")
def get_requests():
    user_id = get_jwt_identity()
    user_requests = Request.query.filter_by(user_id=user_id).all()
    return jsonify([r.to_dict() for r in user_requests]), 200

@employee_bp.route('/request-asset', methods=['POST'])
@jwt_required()
@role_required("Employee")
def post_request(self):
    data = request.get_json()
    asset_name = data.get("asset_name")
    type = data.get("type")
    reason = data.get("reason") 
    urgency = data.get("urgency")
    if not all([asset_name, type, reason, urgency]):
        return jsonify({'error': 'Missing required fields'}), 400
    new_request = Request(**data)
    db.session.add(new_request)
    db.session.commit()
    return {"message": f" Request for {asset_name} submitted successfully"}, 201