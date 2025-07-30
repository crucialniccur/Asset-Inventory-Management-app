from datetime import datetime
from app.extensions import db

class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    brand = db.Column(db.String(100))
    model_number = db.Column(db.String(100))
    serial_number = db.Column(db.String(100))
    condition = db.Column(db.String(50))
    status = db.Column(db.String(50), default="available")
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ Relationships
    allocations = db.relationship("Allocation", back_populates="asset", cascade="all, delete")
    category = db.relationship("Category", back_populates="assets")
    creator = db.relationship("User", back_populates="created_assets", foreign_keys=[created_by])
