'use strict';
module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		'user',
		{
			email: DataTypes.STRING,
			password: DataTypes.STRING
		},
		{}
	);
	user.associate = function(models) {
		// associations can be defined here
		user.hasMany(models.like);
		user.hasMany(models.message);
	};
	return user;
};
