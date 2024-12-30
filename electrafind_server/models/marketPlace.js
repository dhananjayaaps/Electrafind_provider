const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Marketplace = sequelize.define('marketplace', {
      ProductID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
      },
      Price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AddedByUserID: {
        type: DataTypes.INTEGER,
      },
    });
    return Marketplace;
  };
  