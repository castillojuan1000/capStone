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
				type: Sequelize.INTEGER,
				allowNull: true
			},
			order: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true
			},
			spotifyId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			songImg: {
				type: Sequelize.STRING
			},
			songLength: {
				type: Sequelize.INTEGER,
				allowNull: false
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
