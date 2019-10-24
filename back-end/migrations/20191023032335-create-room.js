'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('rooms', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			hostId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id'
				}
			},
			roomName: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: 'room',
					key: 'id'
				}
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
		return queryInterface.dropTable('rooms');
	}
};
