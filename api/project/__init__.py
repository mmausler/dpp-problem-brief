import click
from flask import Flask
from flask_migrate import Migrate
from werkzeug.middleware.proxy_fix import ProxyFix
from .modules.utils import recreate_db, seed_db

migrate = Migrate()

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

# Connection credentials
db_user = 'admin'
db_pass = 'admin'
db_name = 'app'

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# configuring our database uri
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://{username}:{password}@mysqldb/{dbname}".format(username = db_user, password = db_pass, dbname = db_name)

from . import extensions
extensions.init_app(app)

migrate.init_app(app, extensions.db)

from . import modules
modules.initiate_app(app)

@app.cli.command("recreate-db")
def recreate():
    recreate_db()

@app.cli.command("seed-db")
def seed():
    seed_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)
