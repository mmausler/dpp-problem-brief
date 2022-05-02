# Base Image
FROM python:3.7.2-slim

RUN apt-get update && \
    apt-get -y install python3-dev default-libmysqlclient-dev build-essential && \
    apt-get clean

# set working directory
WORKDIR /usr/src/app

# add and install requirements
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# add app
COPY . /usr/src/app

# run server
# ENTRYPOINT [ "flask" ]
# CMD ["run", "--host=0.0.0.0", "--port=5000"]
