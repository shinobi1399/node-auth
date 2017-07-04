FROM node:8
ADD ./package.json /app/
WORKDIR /app
RUN npm install
RUN npm install -g rimraf typescript nodemon
WORKDIR /app/mnt
CMD ["npm", "run", "start:dev"]
