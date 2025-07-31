from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.request import Request, RequestStatus, RequestType, UrgencyLevel
from app.models.user import User, UserRole
from app.models.activity_log import ActivityLog
from app.extensions import db
from app.utils.decorators import role_required
from datetime import datetime, timezone
from app.models.budget import Budget


requests_bp = Blueprint("requests", __name__)

# ✅ Submit a new asset or repair request (Employee)
@requests_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Employee")
def submit_request():
    user_id = get_jwt_identity()
    data = request.get_json()

    request_type = data.get("request_type", "").upper()
    urgency = data.get("urgency", "").upper()

    if request_type not in ["NEW", "REPLACEMENT", "REPAIR"]:
        return jsonify({"error": "Invalid request_type"}), 400

    if urgency not in ["LOW", "MEDIUM", "HIGH"]:
        return jsonify({"error": "Invalid urgency level"}), 400

    if request_type in ["NEW", "REPLACEMENT"]:
        required_fields = ["asset_name", "asset_description", "brand", "category_id", "estimated_cost", "justification", "reason", "urgency"]
    else:
        required_fields = ["asset_id", "issue_description", "estimated_cost", "justification", "reason", "urgency"]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    new_request = Request(
        user_id=user_id,
        request_type=RequestType[request_type].value,
        urgency=UrgencyLevel[urgency].value,
        reason=data["reason"],
        justification=data.get("justification"),
        asset_id=data.get("asset_id"),
        asset_name=data.get("asset_name"),
        asset_description=data.get("asset_description"),
        brand=data.get("brand"),
        issue_description=data.get("issue_description"),
        estimated_cost=data.get("estimated_cost"),
        category_id=data.get("category_id")
    )

    db.session.add(new_request)
    db.session.commit()

    # 🔍 Log Activity
    db.session.add(ActivityLog(
        user_id=user_id,
        action="Submitted Request",
        target_type="Request",
        target_id=new_request.id,
        timestamp=datetime.now(timezone.utc)
    ))
    db.session.commit()

    return jsonify({"message": "Request submitted successfully"}), 201

# ✅ Employee view their own requests
@requests_bp.route("/my", methods=["GET"])
@jwt_required()
@role_required("Employee")
def my_requests():
    user_id = get_jwt_identity()
    requests = Request.query.filter_by(user_id=user_id).all()
    return jsonify([format_request(r) for r in requests]), 200

# ✅ Manager view all requests
@requests_bp.route("/", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement", "Finance")
def get_all_requests():
    requests = Request.query.order_by(Request.created_at.desc()).all()
    return jsonify([format_request(r) for r in requests]), 200

# ✅ Approve (Procurement)
@requests_bp.route("/<int:request_id>/approve", methods=["PUT"])
@jwt_required()
@role_required("Procurement")
def approve_request(request_id):
    user_id = get_jwt_identity()
    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    req.status = RequestStatus.APPROVED.value
    req.approved_by = user_id
    req.approved_at = datetime.now(timezone.utc)
    db.session.commit()

    db.session.add(ActivityLog(
        user_id=user_id,
        action="Approved Request",
        target_type="Request",
        target_id=request_id,
        timestamp=datetime.now(timezone.utc)
    ))
    db.session.commit()

    return jsonify({"message": "Request approved"}), 200

# ✅ Finance Approval
@requests_bp.route("/<int:request_id>/finance-approve", methods=["PUT"])
@jwt_required()
@role_required("Finance")
def finance_approve(request_id):
    user_id = get_jwt_identity()
    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    req.finance_approved = True
    db.session.commit()

    db.session.add(ActivityLog(
        user_id=user_id,
        action="Finance Approved Request",
        target_type="Request",
        target_id=request_id,
        timestamp=datetime.now(timezone.utc)
    ))
    db.session.commit()

    return jsonify({"message": "Finance approved"}), 200

# ✅ Reject request (with comment)
@requests_bp.route("/<int:request_id>/reject", methods=["PUT"])
@jwt_required()
@role_required("Procurement", "Finance")
def reject_request(request_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    rejection_reason = data.get("comment")

    if not rejection_reason:
        return jsonify({"error": "Rejection comment is required"}), 400

    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    req.status = RequestStatus.REJECTED.value
    req.rejection_comment = rejection_reason
    db.session.commit()

    db.session.add(ActivityLog(
        user_id=user_id,
        action="Rejected Request",
        target_type="Request",
        target_id=request_id,
        timestamp=datetime.now(timezone.utc)
    ))
    db.session.commit()

    return jsonify({"message": "Request rejected with comment"}), 200

# ✅ Fulfill request
@requests_bp.route("/<int:request_id>/fulfill", methods=["PUT"])
@jwt_required()
@role_required("Procurement")
def fulfill_request(request_id):
    user_id = get_jwt_identity()
    req = Request.query.get(request_id)
    if not req or req.status != RequestStatus.APPROVED.value:
        return jsonify({"error": "Invalid request"}), 400

    req.status = RequestStatus.FULFILLED.value
    req.fulfilled_at = datetime.now(timezone.utc)
    db.session.commit()

    db.session.add(ActivityLog(
        user_id=user_id,
        action="Fulfilled Request",
        target_type="Request",
        target_id=request_id,
        timestamp=datetime.now(timezone.utc)
    ))
    db.session.commit()

    return jsonify({"message": "Request fulfilled"}), 200

# ✅ View Activity Logs (Admin & Procurement)
@requests_bp.route("/activity-logs", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement")
def get_activity_logs():
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).all()
    return jsonify([
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "timestamp": log.timestamp.isoformat()
        } for log in logs
    ]), 200

# ✅ Helper to serialize requests
def format_request(r):
    return {
        "id": r.id,
        "user_id": r.user_id,
        "request_type": r.request_type,
        "urgency": r.urgency,
        "status": r.status,
        "reason": r.reason,
        "justification": r.justification,
        "category_id": r.category_id,
        "asset_id": r.asset_id,
        "asset_name": r.asset_name,
        "asset_description": r.asset_description,
        "brand": r.brand,
        "issue_description": r.issue_description,
        "estimated_cost": r.estimated_cost,
        "finance_approved": r.finance_approved,
        "rejection_comment": getattr(r, "rejection_comment", None),
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "approved_at": r.approved_at.isoformat() if r.approved_at else None,
        "fulfilled_at": r.fulfilled_at.isoformat() if r.fulfilled_at else None
    }
@requests_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@role_required("Employee")
def employee_dashboard():
    user_id = get_jwt_identity()

    assets_count = Allocation.query.filter_by(user_id=user_id).count()
    total_requests = Request.query.filter_by(user_id=user_id).count()
    pending_requests = Request.query.filter_by(user_id=user_id, status="pending").count()
    approved_requests = Request.query.filter_by(user_id=user_id, status="approved").count()

    return jsonify({
        "my_assets_count": assets_count,
        "my_total_requests": total_requests,
        "my_pending_requests": pending_requests,
        "my_approved_requests": approved_requests
    }), 200


@requests_bp.route("/summary/admin", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement")
def admin_summary():
    total_users = User.query.count()
    total_assets = Asset.query.count()
    assets_in_stock = Asset.query.filter_by(status="available").count()
    pending_requests = Request.query.filter_by(status="pending").count()

    return jsonify({
        "total_users": total_users,
        "total_assets": total_assets,
        "assets_in_stock": assets_in_stock,
        "pending_requests": pending_requests
    }), 200




@requests_bp.route("/summary/finance", methods=["GET"])
@jwt_required()
@role_required("Finance")
def finance_summary():
    budget = Budget.query.order_by(Budget.created_at.desc()).first()
    total_budget = budget.total_amount if budget else 0

    budget_used = db.session.query(db.func.sum(Request.estimated_cost)).filter(
        Request.status == "approved"
    ).scalar() or 0

    start_of_month = datetime.now().replace(day=1)
    monthly_spend = db.session.query(db.func.sum(Request.estimated_cost)).filter(
        Request.status == "approved",
        Request.created_at >= start_of_month
    ).scalar() or 0

    pending_approvals = Request.query.filter_by(status="pending").count()

    return jsonify({
        "total_budget": total_budget,
        "budget_used": budget_used,
        "monthly_spend": monthly_spend,
        "pending_approvals": pending_approvals
    }), 200

@requests_bp.route("/<int:request_id>", methods=["DELETE"])
@jwt_required()
def delete_request(request_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    request = Request.query.get(request_id)

    if not request:
        return jsonify({"error": "Request not found"}), 404

    # ✅ Only block if not owner AND not admin/procurement
    if request.user_id != user.id and user.role not in ["admin", "procurement"]:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(request)
    db.session.commit()
    return jsonify({"message": "Request deleted successfully"}), 200
