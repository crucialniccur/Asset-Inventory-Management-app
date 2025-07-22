from models import Request, db
from utils.decorators import role_required
from flask_restful import Resource
from models.request import RequestStatus

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