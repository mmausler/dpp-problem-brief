# DPP Problem Brief

An application to connect people with their lost pets

** Please note this application is not ready for production use **

## Getting Started

This project consists of a Flask application for the backend API, NextJS for the client side application and nginx as a reverse-proxy for connecting the API and the front-end. This project also uses `docker-compose` to coordinate the application containers.

### Prerequisites

Before you run this application make sure you have the following installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [docker-compose](https://docs.docker.com/compose/install/)

### Running Locally

To run the application locally, copy `example.env` to `.env` and adjust the following keys to the values provided separately

```
SENDGRID_FROM_EMAIL='API_EMAIL_HERE'
SENDGRID_API_KEY='API_KEY_HERE'
```

Then run the following command from the project root

```
$ docker-compose up
```

After the docker containers build and launch successfully you can open the application at [http://localhost:8080/](http://localhost:8080/)

You can also view the database at [http://localhost:8081/](http://localhost:8081/)

```
DB Name: app
DB User: admin
DB Pass: admin
```

### API Endpoints

The Flask application running on the `api` container provides two API endpoints, `/api/v1/users` and `/api/v1/pets` which accept `application/json`

#### /api/v1/users

`POST` accepts `fullname: String`, `email: String`

`DELETE` accepts `email: String`

#### /api/v1/pets

`POST` accepts `name: String`, `type: String`, `user_id: Int`

### FTP Scraper Task

This application includes containers that run an FTP server and a Celery task worker that is scheduled to fetch files from this server every 5 minutes. As per the problem brief specification directories on the FTP server are in the format of `month-day-year/pets-month-day-year.csv` ie `04-01-2022/pets-04-01-2022.csv`.

To test the notification service you could sign up a user & pet, and then add a directory and csv file using the naming format above to `ftp/dpp/found_pets/`. When the scraper task is run you should receive an email concerning your pet.

Alternatively you could review one of the existing seed files at `ftp/dpp/found_pets/` and sign up for the service using an existing `user` and `pet`. You should receive an email concerning this pet.

The cron job for this task is set in `api/project/__init__.py` if you would like to adjust the frequency
