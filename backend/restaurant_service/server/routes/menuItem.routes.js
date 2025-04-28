const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItem.controller');

// Menu item CRUD operations
router.post('/', menuItemController.createMenuItem);
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);
router.get('/:id', menuItemController.getMenuItemById);
router.put('/:id', menuItemController.updateMenuItem);
router.delete('/:id', menuItemController.deleteMenuItem);

// Menu item availability management
router.patch('/:id/toggle-availability', menuItemController.toggleMenuItemAvailability);

module.exports = router;