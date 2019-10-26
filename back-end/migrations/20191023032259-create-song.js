'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('songs', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			roomId: {
				type: Sequelize.INTEGER
			},
			order: {
				type: Sequelize.INTEGER
			},
			spotifyId: {
				type: Sequelize.STRING
			},
			songImg: {
				type: Sequelize.STRING
			},
			songLength: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('songs');
	}
};
