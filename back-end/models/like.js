'use strict';
module.exports = (sequelize, DataTypes) => {
	const like = sequelize.define(
		'like',
		{
			userId: DataTypes.INTEGER,
			roomId: DataTypes.INTEGER,
			songId: DataTypes.INTEGER
		},
		{}
	);
	like.associate = function(models) {
		// associations can be defined here
		like.belongsTo(models.user);
		like.belongsTo(models.song);
	};
	return like;
};
