from datetime import datetime
from flask import Blueprint, jsonify, request
from app.models.request import Request, RequestStatus
from app.decorators import role_required
from flask_jwt_extended import jwt_required
from flasgger import swag_from
from app.models import db

procurement_bp = Blueprint('procurement', __name__,
                           url_prefix='/procurement/requests')


@procurement_bp.route('/', methods=['GET'])
@jwt_required()
@role_required("Procurement")
@swag_from({
    'tags': ['Procurement Requests'],
    'description': 'Get all procurement requests (Procurement role only)',
    'responses': {
        200: {
            'description': 'List of procurement requests',
            'schema': {
                'type': 'array',
                'items': {'$ref': '#/definitions/Request'}
            }
        },
        401: {'description': 'Unauthorized'},
        403: {'description': 'Forbidden'}
    }
})
def get_all_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests]), 200


@procurement_bp.route('/<int:request_id>/approve', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
@swag_from({
    'tags': ['Procurement Requests'],
    'description': 'Approve a procurement request by ID',
    'parameters': [
        {'name': 'request_id', 'in': 'path', 'type': 'integer',
            'required': True, 'description': 'Request ID'}
    ],
    'responses': {
        200: {'description': 'Request approved'},
        404: {'description': 'Request not found'},
        401: {'description': 'Unauthorized'}
    }
})
def approve_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.APPROVED
    db.session.commit()
    return {"message": "Request approved"}, 200


@procurement_bp.route('/<int:request_id>/reject', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
@swag_from({
    'tags': ['Procurement Requests'],
    'description': 'Reject a procurement request by ID',
    'parameters': [
        {'name': 'request_id', 'in': 'path', 'type': 'integer',
            'required': True, 'description': 'Request ID'}
    ],
    'responses': {
        200: {'description': 'Request rejected'},
        404: {'description': 'Request not found'},
        401: {'description': 'Unauthorized'}
    }
})
def reject_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.REJECTED
    db.session.commit()
    return {"message": "Request rejected"}, 200


@procurement_bp.route('/<int:request_id>/fulfill', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
@swag_from({
    'tags': ['Procurement Requests'],
    'description': 'Mark a procurement request as fulfilled',
    'parameters': [
        {'name': 'request_id', 'in': 'path', 'type': 'integer',
            'required': True, 'description': 'Request ID'}
    ],
    'responses': {
        200: {'description': 'Request fulfilled'},
        404: {'description': 'Request not found'},
        401: {'description': 'Unauthorized'}
    }
})
def fulfill_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.FULFILLED
    db.session.commit()
    return {"message": "Request fulfilled"}, 200


@procurement_bp.route('/<int:request_id>/status', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
@swag_from({
    'tags': ['Procurement Requests'],
    'description': 'Update procurement request status (APPROVED or REJECTED only)',
    'parameters': [
        {'name': 'request_id', 'in': 'path', 'type': 'integer',
            'required': True, 'description': 'Request ID'},
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'status': {'type': 'string', 'enum': ['APPROVED', 'REJECTED']}
                },
                'required': ['status']
            }
        }
    ],
    'responses': {
        200: {'description': 'Request status updated'},
        400: {'description': 'Invalid status'},
        404: {'description': 'Request not found'},
        401: {'description': 'Unauthorized'}
    }
})
def update_request_status(request_id):
    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["APPROVED", "REJECTED"]:
        return {"error": "Invalid status"}, 400

    asset_request = Request.query.get(request_id)
    if not asset_request:
        return {"error": "Request not found"}, 404

    asset_request.status = new_status
    asset_request.updated_at = datetime.utcnow().strftime("%b %d, %Y at %I:%M %p")

    db.session.commit()
    return {"message": f"Request {new_status.lower()}."}, 200
