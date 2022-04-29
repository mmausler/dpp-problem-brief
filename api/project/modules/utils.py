from project.extensions import db
from .users.models import User as UserModel
from .pets.models import Pet as PetModel

def recreate_db():
    try:
        db.drop_all()
        db.create_all()
        db.session.commit()
        print('DB Recreated')
    except Exception as e:
        print(str(e.orig))

def seed_db():
    try:
        user1 = UserModel('Barry Manilow', None)
        user2 = UserModel('Marge Simpson', None)
        user3 = UserModel('George Jackson', None)
        user4 = UserModel('Tony Soprano', None)
        user5 = UserModel('Sigmund Freud', None)
        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.add(user4)
        db.session.add(user5)
        db.session.commit()
        db.session.add(PetModel(name='Charlie',type='Dog', user_id=user1.id, in_custody=1))
        db.session.add(PetModel(name='Barky',type='Dog', user_id=user2.id, in_custody=1))
        db.session.add(PetModel(name='Crystal',type='Cat', user_id=user3.id, in_custody=1))
        db.session.add(PetModel(name='Gary',type='Bird', user_id=user4.id, in_custody=1))
        db.session.add(PetModel(name='Blink',type='Snake', user_id=user5.id, in_custody=1))
        db.session.commit()
        print('DB Seeded')
    except Exception as e:
        print(str(e.orig))
