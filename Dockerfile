FROM node:10-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]
