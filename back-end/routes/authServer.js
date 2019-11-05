module.exports = function(db) {
	const router = require('express').Router();
	const { createToken, verifyToken } = require('../utils');
	const bcrypt = require('bcryptjs');
	let refreshTokens = [];

	// *** Delete ROUTES
	router.delete('/api/signout', (req, res) => {
		req.session.destroy();
		res.status(200);
		res.send({ data: 'Successfully logged out' });
	});
	// !!
	// *** POST ROUTES
	router.post('/api/login', (req, res) => {
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
						return res.status(401).send({ error: 'User not found!' });
					}
					bcrypt.compare(password, user.password, (err, matched) => {
						if (err) {
							return res.status(500);
						} else if (matched) {
							const accessUser = {
								username: user.username,
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
	router.post('/api/signup', async (req, res) => {
		const { email, password, username } = req.body;

		const passwordHash = bcrypt.hashSync(password, 10);
		db.user
			.create({ email: email.toLowerCase(), password: passwordHash, username })
			.then(user => {
				const accessUser = {
					username: user.username,
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
				return res.status(200).send({
					data: { ...accessUser },
					tokens: { accessToken, refreshToken }
				});
			})
			.catch(e => {
				res.status(500);
				return res.send({
					error_message: 'Could not create Account'
				});
			});
	});

	router.post('/api/token', (req, res) => {
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
			const { id } = tokenRes;
			db.user.findByPk(id).then(user => {
				if (user === null) {
					return res.sendStatus(401);
				}
				const accessToken = createToken({
					data: { email: user.email, id: user.id, username: user.username },
					secret: 'ACCESS'
				});
				res.json({
					tokens: {
						accessToken,
						refreshToken
					},
					data: { email: user.email, id: user.id, username: user.username }
				});
			});
		});
	});

	return router;
};
