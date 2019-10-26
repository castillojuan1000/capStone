'use strict';
module.exports = (sequelize, DataTypes) => {
	const song = sequelize.define(
		'song',
		{
			roomId: DataTypes.INTEGER,
			order: DataTypes.INTEGER,
			spotifyId: DataTypes.STRING,
			songImg: DataTypes.STRING,
			songLength: DataTypes.INTEGER
		},
		{}
	);
	song.associate = function(models) {
		song.belongsTo(models.room);
		song.hasMany(models.like);
		// associations can be defined here
	};
	return song;
};
