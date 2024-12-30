const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const Transaction = sequelize.define('transactions', {
      TransactionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SessionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AmountPaid: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      PaymentMethod: {
        type: DataTypes.ENUM('CreditCard', 'DebitCard', 'UPI', 'Wallet'),
        allowNull: false,
      },
      TransactionTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
    return Transaction;
  };
  