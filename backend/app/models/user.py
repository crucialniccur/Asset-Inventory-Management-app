from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import Enum as PgEnum
import enum

from app.models import db, request, allocation

class UserRole(enum.Enum):
    admin = "Admin"
    procurement = "Procurement"
    finance = "Finance"
    employee = "Employee"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(PgEnum(UserRole, name="user_role_enum"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    requests = db.relationship('Request', back_populates='user', cascade="all, delete-orphan")
    allocations = db.relationship('Allocation', back_populates='user', cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def has_role(self, *roles):
        return self.role.name in roles

    def __repr__(self):
        return f'<User {self.name}>'
