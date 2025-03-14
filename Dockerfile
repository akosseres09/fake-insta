FROM node:18.20.6-alpine

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000", "--port", "4200"]