'use strict';
module.exports = (sequelize, DataTypes) => {
	const song = sequelize.define(
		'songs',
		{
			id: DataTypes.INTEGER,
			roomId: DataTypes.INTEGER,
			order: DataTypes.INTEGER,
			spotifyId: DataTypes.STRING,
			songImg: DataTypes.STRING,
			songLength: DataTypes.INTEGER
		},
		{}
	);
	song.associate = function(models) {
		// associations can be defined here
	};
	return song;
};
