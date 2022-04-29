# DPP Problem Brief

An application to connect people with their lost pets

## Getting Started

This project consists of a Flask application for the backend API, NextJS for the client side application and nginx as a reverse-proxy for connecting the API and the front-end. This project also uses `docker-compose` to coordinate the application containers.

### Prerequisites

Before you run this application make sure you have the following installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [docker-compose](https://docs.docker.com/compose/install/)

### Running Locally

To run the application locally, run the following command from the project root

```
$ docker-compose up
```

#### Database Migration and Seed

```
# Run database migration
$ docker-compose exec api flask db upgrade
# Run database seed
$ docker-compose exec api flask seed-db
```

After you run above commands you can open the application from [http://localhost:8080/](http://localhost:8080/)

You can also view the database at [http://localhost:8081/](http://localhost:8081/)

```
DB Name: app
DB User: admin
DB Pass: admin
```

#### Testing the application

The seeder contains sample user and pet data which you can use to test the registration form. An example is below:

A dog named Charlie was found by DPP and entered into the system with the owner 'Barry Manilow'. If Barry registers with the service, it will notify him that Chalie has been found. If Barry is registering with a second lost pet, this pet will be stored and he will still be notified about Charlie.
