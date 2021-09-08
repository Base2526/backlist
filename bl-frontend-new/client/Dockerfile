# stage: 1
# FROM node as chat-app-dc-build
# WORKDIR /app
# COPY . /app
# RUN npm install

# CMD ["npm", "start"]

# build environment
FROM node:alpine as build

# ENV REACT_APP_PLATFORM website
      
ENV REACT_APP_DEBUG TRUE
ENV REACT_APP_VERSIONS 1.0   
ENV REACT_APP_AUTHORIZATION YWRtaW46MTIzNA== 
ENV REACT_APP_GEOLOCATION https://geolocation-db.com/json/

WORKDIR /app
COPY . .

# yarn cache clean
RUN yarn cache clean
# RUN yarn
RUN yarn install 

# dev
# EXPOSE 3000 < Is defualt post not setup
CMD yarn run start
