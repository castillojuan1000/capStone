const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
// const io = require('socketio');
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const createData = require('./fakerData');
const app = express();
const env = process.env.NODE_ENV;
const myStore = new SequelizeStore({
	db: db.sequelize
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

// *** Attaching middleware for Express
app.use(
	session({
		secret: 'mySecret',
		resave: false,
		saveUninitialized: true,
		store: myStore
	})
);
myStore.sync();

if (process.env.NODE_ENV == 'development') {
	app.use(function(req, res, next) {
		console.log(req.body);
		if (req.session.userId !== undefined) {
			next();
		} else if (req.path == '/api/login' || req.path == '/api/signup') {
			next();
		} else {
			res.status(400);
			res.send('Bad Request');
		}
	});
}

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(4000, () => {
	console.log('Server running! \nhttp://localhost:4000');
});

//*** GET ROUTES
app.get('/', (req, res, next) => {
	res.send('Hello World');
});

app.get('/api/createUsers', (req, res, next) => {
	createData(db);
});

app.get('/api/signout', (req, res) => {
	req.session.destroy();
	res.status(200);
	res.send({ data: 'Successfully logged out' });
});

//*** POST ROUTES
app.post('/api/login', (req, res) => {
	console.log(req.body);
	// res.send({ data: 'Hello' });
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	db.user
		.findOne({
			where: {
				email: email
			}
		})
		.then(user => {
			if (user === null) {
				res.send({ error: 'User not found!' });
			}
			bcrypt.compare(password, user.password, (err, matched) => {
				if (err) {
					console.error(err);
					res.status(400);
				} else if (matched) {
					req.session.userId = user.id;
					res.status(200);
					res.send({ data: 'Success!' });
				} else {
					res.status(400);
					res.send({ error: 'Bad Password!' });
				}
			});
		});
});

app.post('/api/signup', (req, res) => {
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, 10);
	db.user
		.create({ email, password: passwordHash })
		.then(user => {
			req.session.userId = user.id;
			res.status(200);
			res.send({
				data: 'Success'
			});
		})
		.catch(e => {
			res.status(500);
			res.send({
				error_message: 'Could not create Account'
			});
		});
});
