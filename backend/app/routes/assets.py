from flask import Blueprint, request, jsonify
from app.models.asset import Asset
from app.models import db

asset_bp = Blueprint('assets', __name__, url_prefix='/assets')

@asset_bp.route('', methods=['GET'])
def get_assets():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Asset.query.paginate(page=page, per_page=per_page, error_out=False)
    assets = [asset.to_dict() for asset in pagination.items]

    return jsonify({
        "assets": assets,
        "page": page,
        "total_pages": pagination.pages,
        "total_items": pagination.total
    }), 200
