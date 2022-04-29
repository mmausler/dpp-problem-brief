import json
from dataclasses import dataclass
from flask import jsonify
from project.extensions import db

@dataclass
class User(db.Model):
    id: int
    fullname: str
    email: str
    pets: list

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullname = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), nullable=True, unique=True)
    pets = db.relationship('Pet',
                           backref=db.backref('users', lazy=True))

    def __init__(self,
                 fullname: str,
                 email: str = '',
                 pets: list = []):
        self.fullname = fullname
        self.email = email
        self.pets = pets
