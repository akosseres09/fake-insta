FROM node:18.20.6-alpine

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

EXPOSE 4200

CMD ["/bin/sh"]