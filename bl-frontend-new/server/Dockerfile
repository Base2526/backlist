# stage: 1
FROM node:12 as chat-app-server-build
WORKDIR /app
COPY . /app
RUN npm install 

RUN npm install -g nodemon

# CMD ["node", "server.js"]
CMD ["nodemon", "server.js"]

