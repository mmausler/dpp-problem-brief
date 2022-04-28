FROM node:16-alpine

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json

RUN npm install
COPY uswds-package-patch.json /usr/src/app/node_modules/uswds/package.json

EXPOSE 3000
CMD ["npm", "run", "dev"]
