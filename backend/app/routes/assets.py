from flask import Blueprint

asset_bp = Blueprint('assets', __name__)

@asset_bp.route('/assets')
def get_assets():
    return {"message": "Assets route is working"}
