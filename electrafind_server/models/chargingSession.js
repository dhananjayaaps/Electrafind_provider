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
        model: 'users', // Reference the 'users' table
        key: 'UserID', // Foreign key reference to 'UserID'
      },
    },
    providerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chargingStations', // Reference the 'chargingStations' table
        key: 'StationID', // Foreign key reference to 'StationID'
      },
    },
  });

  // Define associations
  ChargingSession.associate = (models) => {
    ChargingSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    ChargingSession.belongsTo(models.ChargingStation, {
      foreignKey: 'providerID',
      as: 'provider',
    });
  };

  return ChargingSession;
};
