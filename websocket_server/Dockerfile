FROM node:latest

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y python

COPY . ./

RUN npm install

EXPOSE 8080

CMD ["node", "app.js"]