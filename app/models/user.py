from datetime import datetime
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import enum
from app.models.activity_log import ActivityLog


# Role definitions
class UserRole(enum.Enum):
    ADMIN = "Admin"
    PROCUREMENT = "Procurement"
    FINANCE = "Finance"
    EMPLOYEE = "Employee"

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.EMPLOYEE)
    department = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ Relationships
    requests = db.relationship(
        "Request",
        back_populates="user",
        cascade="all, delete",
        foreign_keys="Request.user_id"
    )

    allocations = db.relationship(
        "Allocation",
        back_populates="user",
        cascade="all, delete",
        foreign_keys="Allocation.user_id"
    )

    created_assets = db.relationship(
        "Asset",
        back_populates="creator",
        cascade="all, delete",
        foreign_keys="Asset.created_by"
    )

    # ✅ NEW: Activity logs relationship (reverse of ActivityLog.user)
    activity_logs = db.relationship(
        "ActivityLog",
        back_populates="user",
        cascade="all, delete",
        foreign_keys="ActivityLog.user_id"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "department": self.department,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
        }
