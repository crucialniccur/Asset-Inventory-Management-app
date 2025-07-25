from datetime import datetime
from flask import Blueprint, jsonify, request
from app.models.request import Request, RequestStatus
from app.decorators import role_required
from flask_jwt_extended import jwt_required

from app.models import db

procurement_bp = Blueprint('procurement', __name__, url_prefix='/procurement/requests')

@procurement_bp.route('/', methods=['GET'])
@jwt_required()
@role_required("Procurement")
def get_all_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests]), 200

@procurement_bp.route('/<int:request_id>/approve', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
def approve_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.APPROVED
    db.session.commit()
    return {"message": "Request approved"}, 200
    
@procurement_bp.route('/<int:request_id>/reject', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
def reject_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.REJECTED
    db.session.commit()
    return {"message": "Request rejected"}, 200
    
@procurement_bp.route('/<int:request_id>/fulfill', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
def fulfill_request(request_id):
    request = Request.query.get_or_404(request_id)
    request.status = RequestStatus.FULFILLED
    db.session.commit()
    return {"message": "Request fulfilled"}, 200

@procurement_bp.route('/<int:request_id>/status', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
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
