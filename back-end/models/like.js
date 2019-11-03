'use strict';
module.exports = (sequelize, DataTypes) => {
	const like = sequelize.define(
		'like',
		{
			userId: { type: DataTypes.INTEGER },
			roomId: DataTypes.INTEGER,
			spotifyId: DataTypes.STRING
		},
		{}
	);
	like.associate = function (models) {
		// associations can be defined here
		like.belongsTo(models.user);
		// like.belongsTo(models.song);
		like.belongsTo(models.room);
	};
	return like;
};
