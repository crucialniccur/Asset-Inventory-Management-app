from flask import Blueprint, jsonify
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