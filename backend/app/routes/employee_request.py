from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from app.models.request import Request
from app.decorators import role_required
from app.models import db

employee_bp = Blueprint('employee', __name__, url_prefix='/employee')


@employee_bp.route('/my_requests', methods=['GET'])
@jwt_required()
@role_required("Employee")
@swag_from({
    'tags': ['Employee Requests'],
    'description': 'Get all requests made by the logged-in employee',
    'responses': {
        200: {
            'description': 'List of user requests',
            'schema': {
                'type': 'array',
                'items': {'$ref': '#/definitions/Request'}
            }
        },
        401: {'description': 'Unauthorized'},
        403: {'description': 'Forbidden'}
    }
})
def get_requests():
    user_id = get_jwt_identity()
    user_requests = Request.query.filter_by(user_id=user_id).all()
    return jsonify([r.to_dict() for r in user_requests]), 200


@employee_bp.route('/request_asset', methods=['POST'])
@jwt_required()
@role_required("Employee")
@swag_from({
    'tags': ['Employee Requests'],
    'description': 'Submit a new asset request by employee',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'asset_name': {'type': 'string'},
                    'type': {'type': 'string'},
                    'reason': {'type': 'string'},
                    'urgency': {'type': 'string'}
                },
                'required': ['asset_name', 'type', 'reason', 'urgency']
            }
        }
    ],
    'responses': {
        201: {'description': 'Request submitted successfully'},
        400: {'description': 'Missing required fields'},
        401: {'description': 'Unauthorized'}
    }
})
def post_request():
    data = request.get_json()
    asset_name = data.get("asset_name")
    type = data.get("type")
    reason = data.get("reason")
    urgency = data.get("urgency")
    if not all([asset_name, type, reason, urgency]):
        return jsonify({'error': 'Missing required fields'}), 400

    new_request = Request(**data)
    new_request.requested_at = datetime.utcnow().strftime("%b %d, %Y at %I:%M %p")

    db.session.add(new_request)
    db.session.commit()
    return {"message": f" Request for {asset_name} submitted successfully"}, 201
