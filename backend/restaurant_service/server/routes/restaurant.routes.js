const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// Restaurant CRUD operations
router.post('/', restaurantController.createRestaurant);
router.get('/', restaurantController.getRestaurants); // Can filter by adminId
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.get('/admin/:adminId', restaurantController.getRestaurantByAdmin);

// Restaurant status management
router.patch('/:id/toggle-status', restaurantController.toggleRestaurantStatus);

module.exports = router;