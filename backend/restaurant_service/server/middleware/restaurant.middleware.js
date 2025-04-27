const httpStatus = require('http-status');
const Restaurant = require('../models/restaurant.model');

// Verify the restaurant belongs to the admin making the request
const verifyRestaurantAdmin = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Assuming adminId is passed in headers from auth service
    if (restaurant.adminId.toString() !== req.headers['x-admin-id']) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        error: 'You are not authorized to perform this action'
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  verifyRestaurantAdmin
};