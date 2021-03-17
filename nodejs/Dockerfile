FROM node

WORKDIR /usr/src/app

COPY package.json .

RUN apt-get update && \
    apt-get install nano -y 
        
RUN npm install

COPY . .

# ลง nodemon เพราะตอนเราแก้ใข code สามารถ refresh ได้เลย
RUN npm install -g nodemon

EXPOSE 3000

# CMD ["node" "server.js"]
# CMD [ "npm", "start" ]

# CMD ["npm", "run", "start"]
CMD ["forever", "index.js", "3000"]
