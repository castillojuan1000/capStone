const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
var socket = require('socket.io')
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const jsonParser = bodyParser.json();
const db = require('./models');
const createData = require('./fakerData');
const app = express();

// const myStore = new SequelizeStore({
// 	db: db.sequelize
// });

// app.use(
// 	session({
// 		secret: 'mySecret',
// 		resave: false,
// 		saveUninitialized: true
// 		// store: myStore
// 	})
// );

// myStore.sync();
app.use(express.static('./src/Components/Pages'));
// app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res, next) => {
// 	res.send('Hello World');
// });

// app.get('/createUsers', (req, res, next) => {
// 	createData(db);
// });


var server = app.listen(4000, () => {
	console.log('Server running on port 4000');
});

// //! Apollo set up
// const { ApolloServer } = require('apollo-server-express');
// const typeDefs = require('./graphql/schema');
// const resolvers = require('./graphql/resolvers');
// const apolloServ = new ApolloServer({
// 	typeDefs,
// 	resolvers,
// 	context: { models: db }
// });
// apolloServ.applyMiddleware({ app });


//! Socket.io setup

var io = socket(server);

io.on('connection', (socket) => {
	console.log('made socket connection', socket.id)

	//socket is waiting for that connection on the client side 
	//once it get then "chat" message it will call the function
	socket.on('SEND_MESSAGE', function (data) {

		//then grabbing all the sockets and calling a event and then send the data
		io.sockets.emit('RECEIVE_MESSAGE', data)

	})

	socket.on('typing', function (data) {

		// this is broadcasting the message once a person is typing but not to the person typing the message
		socket.broadcast.emit('typing', data)
	})
})