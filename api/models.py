from app import db

class Users(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullname = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), unique=True)

    def __init__(self,
                 fullname: str,
                 email: str = ''):
        self.fullname = fullname
        self.email = email

    def to_json(self):
        return {
            'id': self.id,
            'fullname': self.fullname,
            'email': self.email
        }
