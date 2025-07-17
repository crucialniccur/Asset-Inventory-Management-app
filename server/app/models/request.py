from .user import db

class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    request_type = db.Column(db.String(50))  # new, repair
    description = db.Column(db.Text)
    urgency = db.Column(db.String(50))  # low, medium, high
    quantity = db.Column(db.Integer)
    status = db.Column(db.String(50))  # pending, approved, rejected, completed
    submitted_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'))
    created_at = db.Column(db.DateTime)

    user = db.relationship('User', backref='requests')
    asset = db.relationship('Asset', backref='requests')

    def __repr__(self):
        return f'<Request {self.id} type={self.request_type}>'
