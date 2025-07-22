from decorators import role_required
from flask_restful import Resource
from models import Allocation, db
from flask import request

class AllocateAsset(Resource):
    @role_required("Procurement")
    def post(self):
        data = request.get_json()
        allocation = Allocation(**data)
        db.session.add(allocation)
        db.session.commit()
        return {"message": "Asset allocated"}, 201