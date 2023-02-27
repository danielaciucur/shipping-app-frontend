# build
FROM node:18-alpine as development

WORKDIR /daniela/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@15.1.3

COPY . .

RUN npm run build

EXPOSE 4200

CMD ["ng serve"]
