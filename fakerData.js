const faker = require('faker');
const times = require('lodash/times');
const random = require('lodash/random');
const bcrypt = require('bcryptjs');
const createData = db => {
	db.user.bulkCreate(
		times(10, () => ({
			email: `${faker.name.firstName()}@${faker.name.lastName()}.com`,
			password: bcrypt.hashSync('123456', 10)
		}))
	);
	db.room.bulkCreate(
		times(10, () => ({
			hostId: random(1, 10),
			roomName: faker.name.jobArea()
		}))
	);
	db.message.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			message: faker.lorem.sentence(10)
		}))
	);
	db.like.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			songId: random(1, 10)
		}))
	);
	db.song.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			order: random(1, 10),
			spotifyId: random(100, 999),
			songImg: faker.image.imageUrl(50, 50),
			songLength: random(150, 240)
		}))
	);
	db.like.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			songId: random(1, 10)
		}))
	);
	db.song.bulkCreate(
		times(10, () => ({
			userId: random(1, 10),
			roomId: random(1, 10),
			spotifyId: random(100, 999),
			songImg: faker.image.imageUrl(50, 50),
			songLength: random(150, 240)
		}))
	);
};

module.exports = createData;
