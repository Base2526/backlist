# FROM node:lts-slim
FROM node:9.11
RUN mkdir -p /usr/src/app && chmod 777 /usr/src/app
WORKDIR /usr/src/app

# COPY package.json .
# RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]