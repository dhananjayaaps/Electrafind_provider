const { transaction, user, chargingStation } = require('../models');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({ include: [user, ChargingStation] });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await transaction.findByPk(req.params.id, { include: [user, chargingStation] });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = await transaction.create(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
