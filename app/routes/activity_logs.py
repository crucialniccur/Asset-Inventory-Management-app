# routes/activity_logs.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.activity_log import ActivityLog
from app.models.user import User, UserRole
from app.extensions import db
from app.utils.decorators import role_required

activity_logs_bp = Blueprint("activity_logs", __name__)

@activity_logs_bp.route("/activity-logs", methods=["GET"])
@jwt_required()
@role_required("Admin", "Procurement")
def view_activity_logs():
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).all()
    return jsonify([
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ])
