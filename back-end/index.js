const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
var socket = require('socket.io')
const bcrypt = require('bcrypt');
// const io = require('socketio');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const createData = require('./fakerData');
const app = express();
const env = process.env.NODE_ENV;
const myStore = new SequelizeStore({
	db: db.sequelize
});
const { createToken, verifyToken } = require('./utils');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));
let refreshTokens = [];
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
	app.use(function (req, res, next) {
		const token = req.session.jwtToken && req.session.jwtToken.accessToken;
		console.log(token);
		if (
			req.path === '/api/login' ||
			req.path === '/api/signup' ||
			req.path === '/api/token' ||
			req.path === '/auth/spotify'
		) {
			return next();
		}
		if (token === null) {
			return res.sendStatus(401);
		}
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	});
}

var server = app.listen(4000, () => {
	console.log('Server running on port 4000');
});


//*** GET ROUTES
app.get('/api/hello', (req, res, next) => {
	res.send('Hello World');
});

app.get('/api/createUsers', (req, res, next) => {
	createData(db);
	res.send('Done!');
});
app.get('/api/getRoom', (req, res, next) => {
	db.room.findByPk(1).then(response => {
		res.send(response.getHost());
	});
});

app.delete('/api/signout', (req, res) => {
	req.session.destroy();
	const refreshToken = null;
	refreshTokens = refreshTokens.filter(token => token !== req.body.token);
	res.status(200);
	res.send({ data: 'Successfully logged out' });
});

app.get('/auth/:provider', (req, res) => {
	console.log(req);
	res.redirect('http://127.0.0.1:3000/login');
});

app.get('/getToken', (req, res) => {
	console.log(req);
	res.redirect(
		'https://accounts.spotify.com/authorize?client_id=9fbcf6fdda254c04b4c8406f1f540040&redirect_uri=127.0.0.1:4000/api/auth/spotify&scope=user-read-playback-state%20streaming%20user-read-private%20user-read-currently-playing%20user-modify-playback-state%20user-library-read%20user-library-modify&response_type=token'
	);
});

//*** POST ROUTES
app.post('/api/login', (req, res) => {
	// res.send({ data: 'Hello' });
	const { email, password } = req.body;
	if (email && password) {
		return db.user
			.findOne({
				where: {
					email: email.toLowerCase()
				}
			})
			.then(user => {
				if (user === null) {
					return res.send({ error: 'User not found!' });
				}
				bcrypt.compare(password, user.password, (err, matched) => {
					if (err) {
						console.error(err);
						return res.status(500);
					} else if (matched) {
						const accessUser = {
							email: user.email,
							id: user.id
						};
						const accessToken = createToken({
							data: accessUser,
							secret: 'ACCESS'
						});
						const refreshToken = createToken({
							data: accessUser,
							secret: 'REFRESH'
						});
						req.session.jwtToken = { accessToken, refreshToken };
						refreshTokens.push(refreshToken);
						// let options = {
						// 	maxAge: 1000 * 60 * 15, // would expire after 15 minutes
						// 	httpOnly: true, // The cookie only accessible by the web server
						// 	signed: true // Indicates if the cookie should be signed
						// };
						// res.cookie('jwtAuth', { accessToken, refreshToken }, options);
						return res.status(200).json({
							tokens: { accessToken, refreshToken },
							data: accessUser
						});
					} else {
						return res.status(400).send({ error: 'Bad Password!' });
					}
				});
			});
	}
});

app.post('/api/signup', (req, res) => {
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, 10);
	db.user
		.create({ email, password: passwordHash })
		.then(user => {
			const accessUser = {
				email: user.email,
				id: user.id
			};
			const refreshToken = createToken({
				data: accessUser,
				secret: 'REFRESH'
			});
			refreshTokens.push(refreshToken);
			const accessToken = createToken({
				data: accessUser,
				secret: 'ACCESS'
			});
			req.session.jwtToken = { accessToken, refreshToken };
			res.status(200).send({
				data: { ...accessUser },
				token: accessToken
			});
		})
		.catch(e => {
			res.status(500);
			res.send({
				error_message: 'Could not create Account'
			});
		});
});

app.post('/api/token', (req, res) => {
	const refreshToken = req.body.refreshToken || req.query.refreshToken;
	const accessToken = req.body.accessToken || req.query.accessToken;
	if (refreshToken === null) {
		return res.sendStatus(401).json({ message: 'Must pass a token' });
	}
	verifyToken(refreshToken, 'REFRESH', (err, tokenRes) => {
		if (err) return res.status(401).send({ error: 'token expired' });
		if (tokenRes.expiredAt) {
			// ***  Token is expired
			console.log('Token Expired');
			return res.status(401).send({ error: 'token expired' });
		}
		var actualTimeInSeconds = new Date().getTime() / 1000;
		const current_time = Date.now().valueOf() / 1000;
		const { id, iat, exp } = tokenRes;
		db.user.findByPk(id).then(user => {
			if (user === null) {
				return res.sendStatus(401);
			}
			const accessToken = createToken({
				data: { email: user.email, id: user.id },
				secret: 'ACCESS'
			});
			if (exp) {
				const expTime = new Date(exp);
				console.log(exp, current_time);
			}
			res.json({
				tokens: {
					accessToken,
					refreshToken
				},
				data: { email: user.email, id: user.id }
			});
		});
	});
});

//! CHARTROOM SERVER
app.use(express.static('./src/Components/Pages'));
var io = socket(server);

io.on('connection', (socket) => {
	console.log('made socket connection', socket.id)

	//socket is waiting for that connection on the client side 
	//once it get then "chat" message it will call the function
	//! save the messages to the data base 
	socket.on('SEND_MESSAGE', function (data) {
		db.message.create({
			userId: 1,
			rooomId: 1, message: " "
		})
		//then grabbing all the sockets and calling a event and then send the data
		io.sockets.emit('RECEIVE_MESSAGE', data)

	})

	socket.on('typing', function (data) {

		// this is broadcasting the message once a person is typing but not to the person typing the message
		socket.broadcast.emit('typing', data)
	})
})
