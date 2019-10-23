const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const io = require('socketio');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const jsonParser = bodyParser.json();
const db = require('./models');

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
	res.send('Running');

	db.like.create({ userId: 1, roomId: 1, songId: 1 }).then(console.log);
});

app.listen(3001, () => {
	console.log('Server running! \n http://localhost:3001');
});
