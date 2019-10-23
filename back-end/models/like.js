'use strict';
module.exports = (sequelize, DataTypes) => {
	const like = sequelize.define(
		'likes',
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
	};
	return like;
};
