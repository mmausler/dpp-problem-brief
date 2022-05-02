from flask import Blueprint, jsonify, request, make_response
from flask_restx import Resource, Namespace, Api, fields
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from project.extensions import db
from project.modules.mailer import send_mail

from .models import User as UserModel


users_blueprint = Blueprint('users', __name__)

api = Api(
    users_blueprint,
    title="DPP API - Users",
    doc="/doc/"
)

# ns = api.namespace('users', description="User management")
# api.base_path("/api/v1")

user_model = api.model(
    'User',
    {
        'id': fields.Integer(),
        'fullname': fields.String(),
        'email': fields.String()
    }
)


# @ns.route('/')
class Users(Resource):
    def get(self):
        users = UserModel.query.all()
        response_object = {
            'status': 'success',
            'users': users
        }
        return jsonify(response_object)

    # @api.marshal_with(user_model)
    def post(self):
        post_data = request.get_json()
        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        fullname = post_data.get('fullname')
        email = post_data.get('email')

        try:
            user = UserModel.query.filter(
                db.func.lower(UserModel.fullname) == db.func.lower(fullname)
            ).first()
            if user:
                user.email = email
                db.session.commit()
                for pet in [p for p in user.pets if p.in_custody == 1]:
                    send_mail(user, pet)
            else:
                emailUsed = UserModel.query.filter(
                    db.func.lower(UserModel.email) == db.func.lower(email)
                ).first()
                if emailUsed:
                    response_object = {'status': 'fail', 'message': 'bad-email'}
                    return make_response(jsonify(response_object), HTTPStatus.BAD_REQUEST)
                else:
                    user = UserModel(fullname, email)
                    db.session.add(user)
                    db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            error = str(e.orig)
            response_object = {'status': 'fail', 'message': error}
            return make_response(jsonify(response_object), HTTPStatus.BAD_REQUEST)

        try:
            response_object = {
                'status': 'success',
                'message': f'{email} was added!',
                'data': user
            }
            return jsonify(response_object)
        except Exception as e:
            return response_object

    def delete(self):
        email = request.args.get('email')

        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not email:
            return response_object, HTTPStatus.BAD_REQUEST

        try:
            # remove subscriber
            user = UserModel.query.filter_by(email=email).first()
            user.email = None
            db.session.commit()
            response_object = {
                'status': 'success',
                'message': f'{email} was unsubscribed!',
            }
            return response_object, HTTPStatus.OK
        except Exception as e:
            db.session.rollback()
            return response_object

api.add_resource(Users, '/api/v1/users')
