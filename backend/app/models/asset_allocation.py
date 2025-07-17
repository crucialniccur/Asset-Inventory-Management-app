from .user import db

class AssetAllocation(db.Model):
    __tablename__ = 'asset_allocations'
    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    allocated_on = db.Column(db.DateTime)

    asset = db.relationship('Asset', backref='allocations')
    user = db.relationship('User', backref='allocations')

    def __repr__(self):
        return f'<AssetAllocation asset_id={self.asset_id} user_id={self.user_id}>'
