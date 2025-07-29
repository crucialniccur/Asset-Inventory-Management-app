from app.models import db, allocation
from datetime import datetime
from enum import Enum
from sqlalchemy import Enum as SqlEnum
from .serializer_mixin import SerializerMixin


class RequestType(Enum):
    NEWASSET = "New Asset"
    REPAIR = "Repair"

class RequestUrgency(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class RequestStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FULFILLED = "fulfilled"

class Request(db.Model, SerializerMixin):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    asset_name = db.Column(db.String(100), nullable=False)
    type = db.Column(SqlEnum(RequestType),
                     default=RequestType.NEWASSET, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    urgency = db.Column(SqlEnum(RequestUrgency),
                        default=RequestUrgency.LOW, nullable=False)
    status = db.Column(SqlEnum(RequestStatus),
                       default=RequestStatus.PENDING, nullable=False)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="requests")

    allocations = db.relationship(
        "Allocation", back_populates="request", lazy='dynamic')

    def __repr__(self):
        return f"<Request by User {self.user_id} for '{self.asset_name}' - {self.status}>"
