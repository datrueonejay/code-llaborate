FROM node:alpine

RUN apt-get update && apt-get install -y python

WORKDIR /usr/src/app

COPY . ./

RUN npm install

EXPOSE 3001

CMD ["node", "app.js"]