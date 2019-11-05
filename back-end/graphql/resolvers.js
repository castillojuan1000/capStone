const bcrypt = require('bcryptjs');
const resolvers = {
	Query: {
		async getUser(root, { id }, { models }) {
			return models.user.findByPk(id);
		},
		async getUserByEmail(root, { email }, models) {
			return models.user.findAll({ where: { email: email } });
		},
		async getRoom(root, { id }, { models }) {
			return models.room.findByPk(id);
		},
		async getSong(root, { id }, { models }) {
			return models.song.findByPk(id);
		},
		async getAllSongs(root, { id }, { models }) {
			return models.song.findAll();
		},
		async getAllRooms(root, { id }, { models }) {
			return models.room.findAll();
		}
	},
	Mutation: {
		async createUser(root, { email, password, username }, { models }) {
			const user = {
				email: email.toLowerCase(),
				password: await hashPass(password),
				username
			};
			return models.user.create(user);
		},
		async createLike(root, { userId, roomId, spotifyId }, { models }) {
			return models.like.create({ userId, roomId, spotifyId });
		},
		async createRoom(root, { hostId, roomName }, { models }) {
			return models.room.create({ hostId, roomName });
		}
	},
	User: {
		async likes(like) {
			return like.getLikes();
		},
		async messages(messages) {
			return messages.getMessages();
		}
	},
	Message: {
		async user(user) {
			return user.getUser();
		},
		async room(room) {
			return room.getRoom();
		}
	},
	Room: {
		async likes(like) {
			return like.getLikes();
		},
		async songs(song) {
			return song.getSongs();
		},
		async messages(message) {
			return message.getMessages();
		},
		async host(host) {
			return host.getHost();
		}
	},
	Song: {
		async room(room) {
			return room.getRoom();
		},
		async likes(like) {
			return like.getLikes();
		}
	},
	Like: {
		async room(room) {
			return room.getRoom();
		},
		async user(user) {
			return user.getUser();
		}
	}
};
const hashPass = password => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, function(err, hash) {
			if (err) {
				return reject(err);
			} else {
				return resolve(hash);
			}
		});
	});
};
module.exports = resolvers;
