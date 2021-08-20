FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN NODE_ENV=production npm install

COPY ./ ./
