FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD npx sequelize-cli db:create | npx sequelize db:migrate

ENTRYPOINT ["npm", "start"]