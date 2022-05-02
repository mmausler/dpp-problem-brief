from project.extensions import db
from flask_migrate import migrate, upgrade
from .users.models import User as UserModel
from .pets.models import Pet as PetModel

def recreate_db():
    try:
        db.drop_all()
        migrate()
        upgrade()
        # db.create_all()
        # db.session.commit()
        print('DB Recreated')
    except Exception as e:
        print(str(e.orig))

def seed_db():
    try:
        user1 = UserModel('Barry Manilow', 'michaelmausler@gmail.com')
        db.session.add(user1)
        db.session.commit()
        db.session.add(PetModel(name='Charlie',type='Dog', user_id=user1.id, in_custody=0))
        db.session.commit()
        print('DB Seeded')
    except Exception as e:
        print(str(e.orig))
