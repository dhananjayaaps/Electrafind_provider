const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const ChargingSession = sequelize.define('chargingsessions', {
      SessionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      BookingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndTime: {
        type: DataTypes.DATE,
      },
      PowerCharged: {
        type: DataTypes.FLOAT,
      },
      Cost: {
        type: DataTypes.FLOAT,
      },
      Status: {
        type: DataTypes.ENUM('InProgress', 'Completed', 'Cancelled'),
        allowNull: false,
      },
    });
    return ChargingSession;
  };
  