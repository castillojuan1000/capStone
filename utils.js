const jwt = require('jsonwebtoken');

module.exports.createToken = ({ data, secret }) => {
	const loadSecret =
		secret === 'REFRESH' ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET';
	const expiry = secret === 'REFRESH' ? '24h' : '1h';
	return jwt.sign(data, process.env[loadSecret], { expiresIn: expiry });
};
module.exports.verifyToken = (token, secret, callback) => {
	const loadSecret =
		secret === 'REFRESH' ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET';
	return jwt.verify(token, process.env[loadSecret], callback);
};
