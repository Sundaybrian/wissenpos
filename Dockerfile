FROM node:12.6.0-alpine

WORKDIR /usr/src/app

# copy package,json and package .lock to work directory
COPY package*.json ./

RUN npm install

# copy everything over to the container
COPY . .

EXPOSE 5000

CMD ["npm", "start"]