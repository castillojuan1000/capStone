'use strict';
module.exports = (sequelize, DataTypes) => {
	const room = sequelize.define(
		'room',
		{
			hostId: DataTypes.INTEGER,
			roomName: DataTypes.STRING
		},
		{}
	);
	room.associate = function(models) {
		// associations can be defined here
		room.hasMany(models.song);
	};
	return room;
};
