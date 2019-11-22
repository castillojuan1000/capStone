const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const authServer = require('./routes/authServer');
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
if (process.env.NODE_ENV !== 'production') {
	app.use(express.static(__dirname + './../front-end/build'));
	app.get('*', function(request, response) {
		response.sendFile('index.html', { root: './../front-end/build' });
	});
}
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
app.use(authServer(db));
if (process.env.NODE_ENV !== 'development') {
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
			return next();
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

app.post('/api/createroom/', (req, res) => {
	const { hostId, roomName } = req.body;
	if (hostId) {
		db.room
			.create({
				hostId,
				roomName
			})
			.then(room => {
				return res.status(200).json({
					message: 'Created room!',
					roomId: room.id
				});
			});
	} else {
		return res.status(401).json({
			error: 'PLEASE PROVIDE A HOST ID'
		});
	}
});

//! CHARTROOM SERVER
var http = require('http').createServer(app);
http.listen(process.env.PORT || 3000, () =>
	console.log('Server running! \n http://localhost:' + process.env.PORT)
);
var io = require('socket.io')(http);
io.origins('*:*');
io.of('/rooms').on('connection', socket => {
	socket.on('JOIN_ROOM', function(data) {
		const { roomId } = data;
		socket.join(`room${roomId}`);
	});
	//socket is waiting for that connection on the client side
	//once it get then "chat" message it will call the function

	//! save the messages to the data base
	socket.on('SEND_MESSAGE', function(data) {
		console.log(data);
		db.message.create({
			userId: data.authorId,
			roomId: data.roomId,
			message: data.message
		});
		//then grabbing all the sockets and calling a event and then send the data
		socket.to(`room${data.roomId}`).emit('RECEIVE_MESSAGE', data);
	});

	socket.on('typing', function(data) {
		// this is broadcasting the message once a person is typing but not to the person typing the message
		socket.emit('typing', data);
	});
});
io.on('connection', socket => {
	socket.on('REQUEST_PLAYER_STATE', data => {
		io.emit('SYNC_PLAYER', data);
	});
	socket.on('SEND_PLAYER_STATE', data => {
		const { socketId, player, roomId } = data;
		if (roomId) {
			io.emit('RECEIVE_PLAYER_STATE', { player, roomId });
		}
		io.to(socketId).emit('RECEIVE_PLAYER_STATE', { player, socketId });
	});
});
