import os
import csv
from ftputil import FTPHost
from flask import current_app
from project.extensions import db
from project.modules.users.models import User as UserModel
from project.modules.pets.models import Pet as PetModel
from project.modules.mailer import send_mail

local_dir = './ftp_downloads'

def fetch_files():
    try:
        if not os.path.exists(local_dir):
            os.makedirs(local_dir)

        with FTPHost(
                current_app.config['FTP_HOST'],
                current_app.config['FTP_USER'],
                current_app.config['FTP_PASS']
        ) as host:
            new_local_filepaths = []
            host.chdir(current_app.config['FTP_PET_ROOT_DIR'])
            dirs = host.listdir(host.curdir)
            local_dirs = os.listdir(local_dir)
            new_dirs = list(set(dirs) - set(local_dirs))
            for dir in new_dirs:
                file = "pets-{}.csv".format(dir)
                host_filepath = os.path.join(dir, file)
                if host.path.isfile(host_filepath):
                    local_dirpath = os.path.join(local_dir, dir)
                    os.mkdir(local_dirpath)
                    local_filepath = os.path.join(local_dirpath, file)
                    host.download(host_filepath, local_filepath)
                    new_local_filepaths.append(local_filepath)
                    print("downloaded " + local_filepath)
            scrape_files(new_local_filepaths)
    except Exception as e:
        print(str(e))

def scrape_files(filepaths):
    pets = []
    try:
        for name in filepaths:
            with open(name, 'r') as csvfile:
                datareader = csv.reader(csvfile)
                for row in datareader:
                    pets.append(row)
        add_pets(pets)
    except Exception as e:
        print(str(e))

def add_pets(pets):
    try:
        for dpp_id, pet_type, pet_name, owner_name in pets:

            user = UserModel.query.filter(
                db.func.lower(UserModel.fullname) == db.func.lower(owner_name)
            ).first()

            if user is None:
                user = UserModel(owner_name, None)
                db.session.add(user)
                db.session.commit()

            pet = PetModel(dpp_id, pet_name, pet_type, user.id, 1)
            pet_match = pet.findMatch()

            if pet_match is None:
                db.session.add(pet)
                db.session.commit()
            elif pet_match.dpp_id == None and pet_match.in_custody == 0:
                pet_match.dpp_id = dpp_id
                pet_match.in_custody = 1
                db.session.add(pet_match)
                db.session.commit()

                send_mail(user, pet_match)

        print('Pets and Users added to DB')
    except Exception as e:
        print(str(e))
