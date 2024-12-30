const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Booking = sequelize.define('bookings', {
      BookingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SlotID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ReferenceNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      BookingTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
    return Booking;
  };
  