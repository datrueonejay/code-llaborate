# From https://mherman.org/blog/dockerizing-a-react-app/

# build environment
FROM node:latest
# FROM ubuntu:latest
# USER root
# RUN apt-get update
# RUN apt-get -y install curl gnupg
# RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
# RUN apt-get -y install nodejs
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.0.1 -g
COPY . /app
CMD ["npm", "run", "start"]
# RUN npm run build

# production environment
# FROM nginx:1.16.0-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]