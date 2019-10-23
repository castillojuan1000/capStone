const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const io = require('socketio');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const SequelizeStore = require('connect-session-sequelize');
const jsonParser = bodyParser.json();

const myStore = new SequelizeStore({
	db: db.sequelize
});
