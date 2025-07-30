from app.extensions import db
from datetime import datetime

class Allocation(db.Model):
    __tablename__ = 'allocations'

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    allocated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 🔥 Make sure these match the related model back_populates
    asset = db.relationship("Asset", back_populates="allocations")
    user = db.relationship("User", back_populates="allocations")
