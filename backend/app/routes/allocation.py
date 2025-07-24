from app.decorators import role_required
from app.models.allocation import Allocation
from app.models.asset import Asset
from app.models.user import User
from app.models.request import Request
from flask import request
from flask_jwt_extended import jwt_required
from app.models import db
from flask import Blueprint

asset_allocation_bp = Blueprint('allocation', __name__, url_prefix='/procurement/requests/<int:request_id>')

@asset_allocation_bp.route('/allocate', methods=['PATCH'])
@jwt_required()
@role_required("Procurement")
def allocate_asset(request_id):
    data = request.get_json()
    
    asset_id = data.get("asset_id")
    user_id = data.get("user_id")
    
    asset = Asset.query.get(asset_id)
    if not asset:
        return {"error": "Asset not found"}, 404

    existing_allocation = Allocation.query.filter_by(asset_id=asset_id).first()
    if existing_allocation:
        return {"error": "Asset already allocated"}, 400

    employee = User.query.get(user_id)
    if not employee or employee.role != "Employee":
        return {"error": "Invalid employee"}, 400

    asset_request = Request.query.get(request_id)
    if not asset_request or asset_request.status != "APPROVED":
        return {"error": "Invalid or unapproved request"}, 400

    allocation = Allocation(asset_id=asset_id, user_id=user_id, request_id=request_id)
    db.session.add(allocation)
    db.session.commit()

    return {"message": "Asset allocated successfully"}, 201
