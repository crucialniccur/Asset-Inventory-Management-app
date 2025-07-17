from app.models import db
from datetime import datetime

class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    asset_name = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="requests")

    def __repr__(self):
        return f"<Request by User {self.user_id} for '{self.asset_name}' - {self.status}>"
