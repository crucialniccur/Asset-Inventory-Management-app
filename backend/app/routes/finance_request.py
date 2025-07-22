from flask import Blueprint, jsonify
from models.request import Request
from utils.decorators import role_required
from flask_jwt_extended import jwt_required

finrequests_bp = Blueprint('financerequests', __name__, url_prefix='/finance')

@requests_bp.route('/requests', methods=['GET'])
@jwt_required()
@role_required("Finance")
def get_all_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests]), 200