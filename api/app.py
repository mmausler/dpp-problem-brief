from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from flask_restx import Resource, Api, reqparse
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
CORS(app)
# api = Blueprint('api', __name__)
api = Api(app)

# Connection credentials
db_user = 'admin'
db_pass = 'admin'
db_name = 'app'

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# configuring our database uri
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://{username}:{password}@mysqldb/{dbname}".format(username = db_user, password = db_pass, dbname = db_name)


db = SQLAlchemy(app)
migrate = Migrate(app, db)

class UsersModel(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullname = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), nullable=True, unique=True)

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

class PetsModel(db.Model):

    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), nullable=False)
    type = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=True)

    def __init__(self,
                 name: str,
                 type: str,
                 user_id: int):

        self.name = name
        self.type = type
        self.user_id = user_id

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'user_id': self.user_id
        }

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

class Users(Resource):
    def get(self):
        return {'hello': 'users'}
    def post(self):
        post_data = request.get_json()
        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        fullname = post_data.get('fullname')
        email = post_data.get('email')
        user = UsersModel(fullname, email)

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return response_object

        try:
            response_object = {
                'status': 'success',
                'message': f'{email} was added!',
                'data': user.to_json()
            }
            return response_object, HTTPStatus.CREATED
        except Exception as e:
            return response_object

    def delete(self):
        email = request.args.get('email')

        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not email:
            return response_object, HTTPStatus.BAD_REQUEST

        try:
            # remove subscriber
            UsersModel.query.filter_by(email=email).delete()
            db.session.commit()
            response_object = {
                'status': 'success',
                'message': f'{email} was unsubscribed!',
            }
            return response_object, HTTPStatus.OK
        except Exception as e:
            return response_object


class Pets(Resource):
    def get(self):
        return {'hello': 'pets'}
    def post(self):
        post_data = request.get_json()
        response_object = {'status': 'fail', 'message': 'Invalid payload'}

        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        name = post_data.get('name')
        type = post_data.get('type')
        user_id = post_data.get('user_id')
        pet = PetsModel(name, type, user_id)

        try:
            db.session.add(pet)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return response_object

        try:
            response_object = {
                'status': 'success',
                'message': f'{name} was added!',
                'data': pet.to_json()
            }
            return response_object, HTTPStatus.CREATED
        except Exception as e:
            return response_object

class Recreate(Resource):
    def get(self):
        response_object = {'status': 'success', 'message': 'recreated'}
        db.drop_all()
        db.create_all()
        db.session.commit()
        return response_object

class Seed(Resource):
    def get(self):
        response_object = {'status': 'success', 'message': 'seeded'}
        user1 = UsersModel('Mingus Dew',None)
        user2 = UsersModel('Marge Simpson',None)
        user3 = UsersModel('Barry Manilow',None)
        user4 = UsersModel('Tony Soprano',None)
        user5 = UsersModel('Sigmund Freud',None)
        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.add(user4)
        db.session.add(user5)
        db.session.commit()
        db.session.add(PetsModel(name='Charlie',type='Dog', user_id=user1.id))
        db.session.add(PetsModel(name='Barky',type='Dog', user_id=user2.id))
        db.session.add(PetsModel(name='Crystal',type='Cat', user_id=user3.id))
        db.session.add(PetsModel(name='Gary',type='Bird', user_id=user4.id))
        db.session.add(PetsModel(name='Blink',type='Snake', user_id=user5.id))
        db.session.commit()
        return response_object

# app.register_blueprint(api, url_prefix='/api')

api.add_resource(HelloWorld, '/api/v1/hello')
api.add_resource(Users, '/api/v1/users')
api.add_resource(Pets, '/api/v1/pets')
api.add_resource(Seed, '/api/v1/seed')
api.add_resource(Recreate, '/api/v1/recreate')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)
