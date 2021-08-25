FROM node:12
# Create and change to the app directory.
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

COPY . .

RUN npm install

# ลง nodemon เพราะตอนเราแก้ใข code สามารถ refresh ได้เลย
RUN npm install -g nodemon

# Copy app source code
# COPY . .

#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]