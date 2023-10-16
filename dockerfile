FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY config config
COPY src src

RUN npm run sass

ENV NODE_ENV production

expose 7000
