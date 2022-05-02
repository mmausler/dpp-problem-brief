import os
import json
from flask import current_app
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_mail(user, pet):
    message = Mail(
        from_email=current_app.config['SENDGRID_FROM_EMAIL'],
        to_emails=user.email)
    message.dynamic_template_data = {
        'user': {
            'fullname': user.fullname
        },
        'pet': {
            'name': pet.name,
            'type': pet.type
        }
    }
    message.template_id = 'd-d992078ec99748f4a2fbe660f700ce2e'
    try:
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(str(e))
