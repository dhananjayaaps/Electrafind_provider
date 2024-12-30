const { MarketplaceItem } = require('../models');

// Get all marketplace items
exports.getAllItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await MarketplaceItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const newItem = await MarketplaceItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const updated = await MarketplaceItem.update(req.body, { where: { ItemID: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await MarketplaceItem.destroy({ where: { ItemID: req.params.id } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
