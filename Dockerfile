
FROM node:15-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package*.json  ./

# install dependencies
RUN npm install

COPY . .

FROM node:15-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .

EXPOSE 3000

CMD [ "node", "./bin/server.js" ]