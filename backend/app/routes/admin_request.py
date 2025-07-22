from models.request import RequestStatus
from flask_restful import Resource
from models import Request, db
from decorators import role_required

class AllRequests(Resource):
    @role_required("Admin", "Procurement", "Finance")
    def get(self):
        requests = Request.query.all()
        return [r.to_dict() for r in requests], 200
    
class ApproveRequest(Resource):
    @role_required("Procurement")
    def patch(self, request_id):
        request = Request.query.get_or_404(request_id)
        request.status = RequestStatus.APPROVED
        db.session.commit()
        return {"message": "Request approved"}, 200
    
class RejectRequest(Resource):
    @role_required("Procurement")
    def patch(self, request_id):
        request = Request.query.get_or_404(request_id)
        request.status = RequestStatus.REJECTED
        db.session.commit()
        return {"message": "Request rejected"}, 200
    
class FulfillRequest(Resource):
    @role_required("Procurement")
    def patch(self, request_id):
        request = Request.query.get_or_404(request_id)
        request.status = RequestStatus.FULFILLED
        db.session.commit()
        return {"message": "Request fulfilled"}, 200