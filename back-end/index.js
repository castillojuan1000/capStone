const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const io = require('socketio');
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const jsonParser = bodyParser.json();
const db = require('./models');
const createData = require('./fakerData');
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

app.get('/', (req, res, next) => {
	res.send('Hello World');
});

app.get('/createUsers', (req, res, next) => {
	createData(db);
});

app.listen(3001, () => {
	console.log('Server running! \n http://localhost:3001');
});

//! Apollo set up
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const apolloServ = new ApolloServer({
	typeDefs,
	resolvers,
	context: { models: db }
});
apolloServ.applyMiddleware({ app });
