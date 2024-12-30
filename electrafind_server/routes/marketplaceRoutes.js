const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

router.get('/', marketplaceController.getAllItems);
router.get('/:id', marketplaceController.getItemById);
router.post('/', marketplaceController.createItem);
router.put('/:id', marketplaceController.updateItem);
router.delete('/:id', marketplaceController.deleteItem);

module.exports = router;
