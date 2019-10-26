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
		room.hasMany(models.like);
		room.hasMany(models.message);
		room.belongsTo(models.user, { foreignKey: 'hostId', as: 'host' });
	};
	return room;
};
