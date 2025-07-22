from flask_restful import Resource
from flask import jsonify, request
from models import Request, db
from decorators import role_required

class SubmitAssetRequest(Resource):
    @role_required("Employee")
    def post(self):
        data = request.get_json()

        asset_name = data.get("asset_name")
        type = data.get("type")
        reason = data.get("reason") 
        urgency = data.get("urgency")

        if not all([asset_name, type, reason, urgency]):
            return jsonify({'error': 'Missing required fields'}), 400

        new_request = Request(**data)
        db.session.add(new_request)
        db.session.commit()

        return {"message": " Request submitted successfully"}, 201