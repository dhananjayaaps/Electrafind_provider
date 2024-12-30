const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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

  // Hash password before saving
  User.addHook('beforeCreate', async (user) => {
    if (user.PasswordHash) {
      const hashedPassword = await bcrypt.hash(user.PasswordHash, 10);
      user.PasswordHash = hashedPassword;
    }
  });

  return User;
};
