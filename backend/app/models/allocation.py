from app.models import db, asset, user
from datetime import datetime

class Allocation(db.Model):
    __tablename__ = 'allocations'

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey("requests.id"))
    allocated_at = db.Column(db.DateTime, default=datetime.utcnow)

    asset = db.relationship("Asset", back_populates="allocations")
    user = db.relationship("User", back_populates="allocations")
    request = db.relationship("Request", back_populates="allocations")

    def __repr__(self):
        return f"<Allocation Asset {self.asset_id} -> User {self.user_id}>"
