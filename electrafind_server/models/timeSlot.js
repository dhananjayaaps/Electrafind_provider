
const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const TimeSlot = sequelize.define('timeslots', {
      SlotID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      IsAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });
    return TimeSlot;
  };
  