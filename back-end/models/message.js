'use strict';
module.exports = (sequelize, DataTypes) => {
	const message = sequelize.define(
		'message',
		{
			userId: DataTypes.INTEGER,
			roomId: DataTypes.INTEGER,
			message: DataTypes.STRING
		},
		{}
	);
	message.associate = function(models) {
		// associations can be defined here
		message.belongsTo(models.user);
	};
	return message;
};
