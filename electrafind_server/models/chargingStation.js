const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const ChargingStation = sequelize.define('chargingStation', {
    StationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
      },
    },
    Longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
      },
    },
    AvailableStartTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    AvailableEndTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Prices: {
      type: DataTypes.TEXT, // JSON stored as string
      allowNull: false,
      get() {
        return JSON.parse(this.getDataValue('Prices')); // Parse JSON on retrieval
      },
      set(value) {
        this.setDataValue('Prices', JSON.stringify(value)); // Convert to JSON string before saving
      },
    },
    ImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    VerificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    QRCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

   ChargingStation.beforeCreate(async (station) => {
    station.Password = await bcrypt.hash(station.Password, 10);
  });

    ChargingStation.beforeSave(async (station) => {
    if (typeof station.Prices !== 'string') {
      station.Prices = JSON.stringify(station.Prices);
    }
  });

  return ChargingStation;
};
