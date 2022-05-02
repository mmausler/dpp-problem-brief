import os
import click
from flask import Flask, Blueprint
from flask_migrate import Migrate
from werkzeug.middleware.proxy_fix import ProxyFix
from celery.schedules import crontab
from celery.utils.log import get_task_logger

migrate = Migrate()

logger = get_task_logger(__name__)

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_port=1, x_for=1, x_host=1, x_prefix=1)

@app.route('/api')
def index():
    return 'Index Page'

app.config['FTP_HOST'] = os.environ['FTP_HOST']
app.config['FTP_USER'] = os.environ['FTP_USER']
app.config['FTP_PASS'] = os.environ['FTP_PASS']
app.config['FTP_PET_ROOT_DIR'] = os.environ['FTP_PET_ROOT_DIR']

app.config['SENDGRID_FROM_EMAIL'] = os.environ['SENDGRID_FROM_EMAIL']
app.config['SENDGRID_API_KEY'] = os.environ['SENDGRID_API_KEY']

# Connection credentials
db_name = os.environ['MYSQL_DB']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASS']


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# configuring our database uri
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://{username}:{password}@mysqldb/{dbname}".format(username = db_user, password = db_pass, dbname = db_name)

# configure celery broker and scheduled tasks
app.config['broker_url'] = os.environ['CELERY_BROKER_URL']
app.config['result_backend'] = os.environ['CELERY_RESULT_BACKEND']
app.config['beat_schedule'] = {
    "periodic_task-every-minute": {
        "task": "project.fetch_ftp",
        "schedule": crontab(minute="*/5")
    }
}


from . import extensions
extensions.init_app(app)

migrate.init_app(app, extensions.db)

from . import modules
modules.initiate_app(app)

from project.modules.tasks import make_celery
celery = make_celery(app)

from project.modules.utils import recreate_db, seed_db
from project.modules.ftp_scraper import fetch_files
# from .modules.mailer import email_users

@celery.task(name='project.fetch_ftp')
def fetch_ftp_task():
    logger.info('Fetching FTP Files')
    fetch_files()

# @celery.task(name='project.email_users')
# def email_users_task():
#     logger.info('Fetching FTP Files')
#     email_users()

@celery.task()
def add_together(a, b):
    return a + b

# @celery.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     # sender.add_periodic_task(300.0, fetch_files(), name='fetch FTP files every 5min')
#     # Calls test('hello') every 10 seconds.
#     sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')

# @app.cli.command("email_users")
# def mail():
#     email_users()

@app.cli.command("fetch_ftp")
def fetch():
    fetch_files()

@app.cli.command("recreate_db")
def recreate():
    recreate_db()

@app.cli.command("seed_db")
def seed():
    seed_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)
