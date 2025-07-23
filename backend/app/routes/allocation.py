from app.decorators import role_required
from app.models.allocation import Allocation
from flask import request
from flask_jwt_extended import jwt_required
from app.models import db
from flask import Blueprint

asset_allocation_bp = Blueprint('allocation', __name__, url_prefix='/procurement/requests/<int:request_id>')

@asset_allocation_bp.route('/allocate', methods=['POST'])
@jwt_required()
@role_required("Procurement")
def allocate_asset():
    data = request.get_json()
    allocation = Allocation(**data)
    db.session.add(allocation)
    db.session.commit()
    return {"message": "Asset allocated"}, 201