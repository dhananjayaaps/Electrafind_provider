const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserType: {
      type: DataTypes.ENUM('VehicleUser', 'GeneralUser', 'Administrator', 'StationHost'),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
    },
    Address: {
      type: DataTypes.TEXT,
    },
  });
  return User;
};
