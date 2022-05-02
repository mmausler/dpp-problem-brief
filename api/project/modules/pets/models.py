import json
from dataclasses import dataclass
from flask import jsonify
from sqlalchemy import and_
from project.extensions import db

@dataclass
class Pet(db.Model):
    id: int
    dpp_id: int
    name: str
    type: str
    user_id: int
    in_custody: int

    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dpp_id = db.Column(db.Integer, nullable=True, unique=True)
    name = db.Column(db.String(128), nullable=False)
    type = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)
    # user = db.relationship('User',
    #                        backref=db.backref('pets', lazy=True))

    in_custody = db.Column(db.Integer, nullable=False)

    def __init__(self,
                 dpp_id: int = None,
                 name: str = '',
                 type: str = '',
                 user_id: int = 1,
                 in_custody: int = 0):
        self.dpp_id = dpp_id
        self.name = name
        self.type = type
        self.user_id = user_id
        self.in_custody = in_custody


    def findMatch(self):
        pet = Pet.query.filter(
            and_(
                db.func.lower(Pet.name) == db.func.lower(self.name),
                db.func.lower(Pet.type) == db.func.lower(self.type),
                Pet.user_id == self.user_id
            )
        ).first()

        return pet
