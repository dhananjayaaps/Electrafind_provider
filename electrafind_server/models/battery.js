const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Battery = sequelize.define('batteries', {
      BatteryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      BatteryType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Capacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Voltage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
    return Battery;
  };
  