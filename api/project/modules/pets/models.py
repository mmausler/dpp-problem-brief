import json
from dataclasses import dataclass
from flask import jsonify
from project.extensions import db

@dataclass
class Pet(db.Model):
    id: int
    name: str
    type: str
    user_id: int
    in_custody: int

    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), nullable=False)
    type = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)
    # user = db.relationship('User',
    #                        backref=db.backref('pets', lazy=True))

    in_custody = db.Column(db.Integer, nullable=False)

    def __init__(self,
                 name: str,
                 type: str,
                 user_id: int,
                 in_custody: int = 0):
        self.name = name
        self.type = type
        self.user_id = user_id
        self.in_custody = in_custody
