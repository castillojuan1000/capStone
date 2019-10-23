'use strict';
module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		'users',
		{
			email: DataTypes.STRING,
			password: DataTypes.STRING
		},
		{}
	);
	user.associate = function(models) {
		// associations can be defined here
		user.hasMany;
	};
	return user;
};
