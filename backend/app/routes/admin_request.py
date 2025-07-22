from models.request import RequestStatus
from flask_restful import Resource
from models import Request, db
from decorators import role_required

class AllRequests(Resource):
    @role_required("Admin", "Procurement", "Finance")
    def get(self):
        requests = Request.query.all()
        return [r.to_dict() for r in requests], 200
