FROM node:18.20.6-alpine

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY frontend-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["/entrypoint.sh"]