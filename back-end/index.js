const express = require('express');
const session = require('express-session');
//const io = require('socketio');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const authRouter = require('./routes/authServer');
const createUsers = require('./fakerData');
const app = express();
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));
app.use(
	session({
		secret: 'mySecret',
		resave: false,
		saveUninitialized: true,
		store: myStore
	})
);
myStore.sync();
const authServer = require('./routes/authServer.js');
app.use(authServer(db));

if (process.env.NODE_ENV == 'development') {
	app.use(function(req, res, next) {
		const token = req.session.jwtToken && req.session.jwtToken.accessToken;
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
app.get('/createusers', (req, res) => {
	createUsers(db);
});

app.listen(4000, () => {
	console.log('Server running! \nhttp://localhost:4000');
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

//! CHARTROOM SERVER
app.use(express.static('./src/Components/Pages'));
var http = require('http').createServer(app);
http.listen(4001);
var io = require('socket.io')(http);
io.on('connection', socket => {
	console.log('made socket connection', socket.id);

	//socket is waiting for that connection on the client side
	//once it get then "chat" message it will call the function
	//! save the messages to the data base
	socket.on('SEND_MESSAGE', function(data) {
		console.log(data);
		db.message.create({
			userId: 1,
			roomId: 1,
			message: data.message
		});
		//then grabbing all the sockets and calling a event and then send the data
		io.sockets.emit('RECEIVE_MESSAGE', data);
	});

	socket.on('typing', function(data) {
		// this is broadcasting the message once a person is typing but not to the person typing the message
		socket.broadcast.emit('typing', data);
	});
});
