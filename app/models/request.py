from datetime import datetime, timezone
from app.extensions import db
from enum import Enum


class RequestStatus(Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    FULFILLED = "Fulfilled"


class RequestType(Enum):
    NEW = "New"
    REPLACEMENT = "Replacement"
    REPAIR = "Repair"


class UrgencyLevel(Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)

    # Request Details
    request_type = db.Column(db.String(50), default=RequestType.NEW.value)
    urgency = db.Column(db.String(50), default=UrgencyLevel.MEDIUM.value)
    status = db.Column(db.String(50), default=RequestStatus.PENDING.value)

    reason = db.Column(db.Text, nullable=False)  # High-level summary of need
    justification = db.Column(db.Text)  # Business case
    estimated_cost = db.Column(db.Float, nullable=True)

    # Asset details (for NEW/REPLACEMENT)
    asset_name = db.Column(db.String(100), nullable=True)
    asset_description = db.Column(db.Text, nullable=True)
    brand = db.Column(db.String(100), nullable=True)

    # Repair-specific
    issue_description = db.Column(db.Text, nullable=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    approved_at = db.Column(db.DateTime, nullable=True)
    fulfilled_at = db.Column(db.DateTime, nullable=True)

    # Approvals
    approved_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    finance_approved = db.Column(db.Boolean, default=False)

    # Rejection comment
    rejection_comment = db.Column(db.Text, nullable=True)

    # Relationships
    user = db.relationship("User", back_populates="requests", foreign_keys=[user_id])
    approved_by_user = db.relationship("User", foreign_keys=[approved_by])



