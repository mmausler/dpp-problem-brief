from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

cross_origin_resource_sharing = CORS()
db = SQLAlchemy()

def init_app(app):
    """
    Application extensions initialization.
    """
    for extension in (
            cross_origin_resource_sharing,
            db
    ):
        extension.init_app(app)
