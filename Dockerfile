FROM node:8-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY "./ihr-webapp/package*.json" "./"
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node app.js