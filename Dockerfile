FROM node:12.6.0-alpine

WORKDIR /usr/src/app

# copy package,json and package .lock to work directory
COPY package.json ./

ARG NODE_ENV

RUN npm install

# copy everything over to the container
COPY . .


# for typescript
# RUN  npm run build
# # COPY .env ./dist/
# WORKDIR ./dist 

# ENV PORT 5001

# EXPOSE $PORT

# CMD ["npm", "start"]

ENV PORT 5000

EXPOSE $PORT


CMD ["npm", "start"]