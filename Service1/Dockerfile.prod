FROM node:21-slim

WORKDIR ./Service1

COPY ./src/. ./src/
COPY ./package.json ./package.json

ARG NODE_ENV
RUN npm install;

CMD ["npm", "run", "start"]


