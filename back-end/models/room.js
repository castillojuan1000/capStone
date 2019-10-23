'use strict';
module.exports = (sequelize, DataTypes) => {
	const room = sequelize.define(
		'rooms',
		{
			hostId: DataTypes.INTEGER,
			roomName: DataTypes.STRING
		},
		{}
	);
	room.associate = function(models) {
		// associations can be defined here
		room.hasMany(models.song);
		room.belongsTo(models.user);
	};
	return room;
};
