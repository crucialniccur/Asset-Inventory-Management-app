from flask import Blueprint, jsonify
from models.request import Request, db
from decorators import role_required
from flask_jwt_extended import jwt_required

requests_bp = Blueprint('adminreq', __name__, url_prefix='/admin/requests')

@requests_bp.route('/', methods=['GET'])
@jwt_required()
@role_required("Admin")
def get_all_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests]), 200