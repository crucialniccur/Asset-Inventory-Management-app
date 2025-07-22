from flask import Blueprint

asset_bp = Blueprint('assets', __name__)

@asset_bp.route('/assets')
def get_assets():
    return {"message": "Assets route is working"}

""" from flask_restful import Resource
from flask import request
from app.models.asset import Asset
from app import db

class AssetListResource(Resource):
    def get(self):
        # Return all assets
        return [a.to_dict() for a in Asset.query.all()], 200

    def post(self):
        data = request.get_json()
        new_asset = Asset(**data)
        db.session.add(new_asset)
        db.session.commit()
        return new_asset.to_dict(), 201


class AssetResource(Resource):
    def get(self, asset_id):
        asset = Asset.query.get_or_404(asset_id)
        return asset.to_dict(), 200

    def put(self, asset_id):
        asset = Asset.query.get_or_404(asset_id)
        data = request.get_json()
        asset.name = data.get("name", asset.name)
        db.session.commit()
        return asset.to_dict(), 200

    def delete(self, asset_id):
        asset = Asset.query.get_or_404(asset_id)
        db.session.delete(asset)
        db.session.commit()
        return {"message": "Deleted"}, 204 """