const { ApolloServer, gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const resolvers = {
	Query: {
		async getUser(root, { id }, { models }) {
			return models.user.findByPk(id);
		},
		async getUserRooms(root, { id }, { models }) {
			return models.room.findAll({
				where: {
					userId: id
				}
			});
		},
		async getUserLikes(root, { id }, { models }) {
			return models.like.findAll({
				where: {
					userId: id
				}
			});
		},
		async getUserMessages(root, { id }, { models }) {
			return models.message.findAll({
				where: {
					userId: id
				}
			});
		},
		async getRoom(root, { id }, { models }) {
			return models.room.findAll({
				where: { id: id }
			});
		},
		async getRoomSongs(root, { id }, { models }) {
			return models.song.findAll({
				where: {
					roomId: id
				}
			});
		},
		async getRoomMessages(root, { id }, { models }) {
			return models.message.findAll({
				where: {
					roomId: id
				}
			});
		},
		async getSong(root, { id }, { models }) {
			return models.song.findAll({
				where: {
					id: id
				}
			});
		},
		async getSongLikes(root, { id }, { models }) {
			return models.like.findAll({ where: { songId: id } });
		}
	},
	Mutation: {
		async createUser(root, { email, password }, { models }) {
			const user = {
				email: email.toLowerCase(),
				password: await hashPass(password)
			};
			return await models.user.create(user);
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
