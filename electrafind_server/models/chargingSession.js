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
    PowerCharged: {
      type: DataTypes.FLOAT,
    },
    Cost: {
      type: DataTypes.FLOAT,
    },
    Status: {
      type: DataTypes.ENUM('pending', 'New', 'Ongoing', 'Completed', 'Cancelled'),
      allowNull: false,
    },
    ChargeType: {
      type: DataTypes.ENUM('Type A', 'Type B', 'Type C'),
      allowNull: true,
    },
    TotalTime: {
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
