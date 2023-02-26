# build
FROM node:18-alpine

WORKDIR /daniela/shipping-app-frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@15.1.3

COPY . .

RUN npm run build

EXPOSE 4200
