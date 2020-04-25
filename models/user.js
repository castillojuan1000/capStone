"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "email",
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password"
      },
      username: {
        type: DataTypes.STRING
      }
    },
    {}
  );
  user.associate = function (models) {
    // associations can be defined here
    user.hasMany(models.like);
    user.hasMany(models.message);
    user.hasMany(models.room, { foreignKey: "hostId" });
  };
  return user;
};
