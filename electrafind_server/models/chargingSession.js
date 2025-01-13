const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChargingSession = sequelize.define('chargingsessions', {
    SessionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StartTime: {
      type: DataTypes.DATE,
    },
    EndTime: {
      type: DataTypes.DATE,
    },
    Cost: {
      type: DataTypes.FLOAT,
    },
    Status: {
      type: DataTypes.ENUM('pending', 'New', 'Ongoing', 'Completed', 'Closed','Cancelled'),
      allowNull: false,
    },
    ChargeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TotalTime: {
      type: DataTypes.INTEGER,
    },
    fixedChargingTime: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'UserID',
      },
    },
    providerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chargingStations',
        key: 'StationID',
      },
    },
  });

  // Define associations
  ChargingSession.associate = (models) => {
    ChargingSession.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user',
    });
    ChargingSession.belongsTo(models.chargingStation, {
      foreignKey: 'providerID',
      as: 'provider',
    });
  };

  return ChargingSession;
};
