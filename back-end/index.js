const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const io = require('socketio');
const times = require('lodash/times');
const random = require('lodash/random');
const bodyParser = require('body-parser');
const faker = require('faker');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const jsonParser = bodyParser.json();
const db = require('./models');
const app = express();

const myStore = new SequelizeStore({
	db: db.sequelize
});

app.use(
	session({
		secret: 'mySecret',
		resave: false,
		saveUninitialized: true
		// store: myStore
	})
);

myStore.sync();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/createUsers', (req, res, next) => {
	db.user
		.bulkCreate(
			times(10, () => ({
				email: `${faker.name.firstName()}@${faker.name.lastName()}.com`,
				password: '123456'
			}))
		)
		.then(console.log);
	db.room
		.bulkCreate(
			times(10, () => ({
				hostId: random(1, 10),
				roomName: faker.name.jobArea()
			}))
		)
		.then(console.log);
	db.message.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			message: faker.lorem.sentence(20)
		}))
	);
});

app.listen(3001, () => {
	console.log('Server running! \n http://localhost:3001');
});

//! Apollo set up
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const apolloServ = new ApolloServer({
	typeDefs,
	resolvers,
	context: { models: db }
});
apolloServ.applyMiddleware({ app });
