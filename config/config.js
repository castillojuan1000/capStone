require('dotenv').config();

module.exports = {
	development: {
		username: process.env.PG_USER || 'postgres',
		password: process.env.PG_PASSWORD || null,
		database: 'spotcloud',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: false
	},
	test: {
		username: process.env.PG_USER || 'postgres',
		password: process.env.PG_PASSWORD || null,
		database: 'spotcloud',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: false
	},
	production: {
		username: process.env.PG_USER || 'postgres',
		password: process.env.PG_PASSWORD || null,
		database: 'spotcloud',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: false
	}
};
