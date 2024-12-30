const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Vehicle = sequelize.define('vehicles', {
      VehicleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      VehicleModel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RegistrationNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      BatteryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Vehicle;
  };
  