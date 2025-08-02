from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, UserRole
from app.models.asset import Asset
from app.models.request import Request, RequestStatus
from app.models.allocation import Allocation
from app.models.activity_log import ActivityLog
from app.extensions import db
from app.utils.decorators import role_required
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    """Get dashboard data based on user role"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Base statistics
    total_assets = Asset.query.count()
    available_assets = Asset.query.filter_by(status="available").count()
    allocated_assets = Asset.query.filter_by(status="in_use").count()

    # Role-specific data
    if user.role in [UserRole.ADMIN, UserRole.PROCUREMENT, UserRole.FINANCE]:
        # Manager/Admin dashboard
        pending_requests = Request.query.filter_by(status=RequestStatus.PENDING.value).count()
        approved_requests = Request.query.filter_by(status=RequestStatus.APPROVED.value).count()
        total_users = User.query.count()

        # Recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_activity = ActivityLog.query.filter(
            ActivityLog.timestamp >= week_ago
        ).order_by(ActivityLog.timestamp.desc()).limit(10).all()

        # Asset allocation stats
        allocation_stats = db.session.query(
            func.count(Allocation.id).label('total_allocations'),
            func.count(Asset.id).label('total_assets')
        ).outerjoin(Asset).first()

        return jsonify({
            "user_role": user.role.value,
            "stats": {
                "total_assets": total_assets,
                "available_assets": available_assets,
                "allocated_assets": allocated_assets,
                "pending_requests": pending_requests,
                "approved_requests": approved_requests,
                "total_users": total_users,
                "total_allocations": allocation_stats.total_allocations if allocation_stats else 0
            },
            "recent_activity": [
                {
                    "id": log.id,
                    "action": log.action,
                    "timestamp": log.timestamp.isoformat(),
                    "user_name": log.user.name if log.user else "Unknown"
                } for log in recent_activity
            ]
        }), 200

    else:
        # Employee dashboard
        user_requests = Request.query.filter_by(user_id=user_id).count()
        pending_user_requests = Request.query.filter_by(
            user_id=user_id,
            status=RequestStatus.PENDING.value
        ).count()

        # User's allocated assets
        user_allocations = Allocation.query.filter_by(user_id=user_id).all()
        allocated_assets_list = [
            {
                "id": alloc.asset.id,
                "name": alloc.asset.name,
                "serial_number": alloc.asset.serial_number,
                "allocated_at": alloc.allocated_at.isoformat()
            } for alloc in user_allocations
        ]

        # User's recent requests
        user_recent_requests = Request.query.filter_by(user_id=user_id).order_by(
            Request.created_at.desc()
        ).limit(5).all()

        return jsonify({
            "user_role": user.role.value,
            "stats": {
                "total_assets": total_assets,
                "available_assets": available_assets,
                "allocated_assets": allocated_assets,
                "my_requests": user_requests,
                "pending_requests": pending_user_requests,
                "my_allocated_assets": len(allocated_assets_list)
            },
            "my_allocated_assets": allocated_assets_list,
            "recent_requests": [
                {
                    "id": req.id,
                    "request_type": req.request_type,
                    "status": req.status,
                    "urgency": req.urgency,
                    "created_at": req.created_at.isoformat(),
                    "reason": req.reason
                } for req in user_recent_requests
            ]
        }), 200

@dashboard_bp.route("/dashboard/summary", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement", "Finance")
def get_summary():
    """Get summary statistics for managers"""
    # Asset summary
    asset_summary = db.session.query(
        Asset.status,
        func.count(Asset.id).label('count')
    ).group_by(Asset.status).all()

    # Request summary
    request_summary = db.session.query(
        Request.status,
        func.count(Request.id).label('count')
    ).group_by(Request.status).all()

    # Category summary
    category_summary = db.session.query(
        Asset.category_id,
        func.count(Asset.id).label('count')
    ).group_by(Asset.category_id).all()

    return jsonify({
        "asset_summary": [
            {"status": status, "count": count}
            for status, count in asset_summary
        ],
        "request_summary": [
            {"status": status, "count": count}
            for status, count in request_summary
        ],
        "category_summary": [
            {"category_id": cat_id, "count": count}
            for cat_id, count in category_summary
        ]
    }), 200
