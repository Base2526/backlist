# FROM node:7
# WORKDIR /app
# # COPY . /app
# RUN npm install
# COPY . /app
# CMD node app.js
# EXPOSE 3030

FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./

COPY . .

RUN npm install

# ลง nodemon เพราะตอนเราแก้ใข code สามารถ refresh ได้เลย
RUN npm install -g nodemon

# Copy app source code
# COPY . .

#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]