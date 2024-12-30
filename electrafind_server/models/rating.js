const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Rating = sequelize.define('ratings', {
      RatingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      Comment: {
        type: DataTypes.TEXT,
      },
      RatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
    return Rating;
  };
  