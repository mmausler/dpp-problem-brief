from flask import Blueprint, jsonify, request
from flask_restx import Resource, Api
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from project.extensions import db

from .models import Pet as PetModel

pets_blueprint = Blueprint('pets', __name__)
api = Api(pets_blueprint)

class Pets(Resource):
    def get(self):
        pets = PetModel.query.all()
        response_object = {
            'status': 'success',
            'pets': pets
        }
        return jsonify(response_object)
    def post(self):
        post_data = request.get_json()
        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        name = post_data.get('name')
        type = post_data.get('type')
        user_id = post_data.get('user_id')

        try:
            pet = PetModel(name=name, type=type, user_id=user_id)
            pet_match = pet.findMatch()
            if pet_match is None:
                db.session.add(pet)
                db.session.commit()
        except IntegrityError:
            response_object = {'status': 'fail', 'message': 'db error'}
            db.session.rollback()
            return response_object

        try:
            response_object = {
                'status': 'success',
                'message': f'{name} was added!',
                'data': pet
            }
            return jsonify(response_object)
        except Exception as e:
            return response_object

api.add_resource(Pets, '/api/v1/pets')
