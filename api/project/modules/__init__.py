from project.modules.users import users_blueprint
from project.modules.pets import pets_blueprint


def initiate_app(app, **kwargs):
    app.register_blueprint(users_blueprint)
    app.register_blueprint(pets_blueprint)
