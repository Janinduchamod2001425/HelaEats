const httpStatus = require('http-status');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');

const createRestaurant = async (req, res) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ adminId: req.body.adminId });
    if (existingRestaurant) {
      return res.status(400).json({ 
        success: false,
        error: 'Admin can only create one restaurant' 
      });
    }

    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    
    return res.status(201).json({ 
      success: true,
      data: restaurant 
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create restaurant' 
    });
  }
};
const getRestaurants = async (req, res) => {
  try {
    const { isActive, cuisineType, adminId } = req.query;
    const filter = {};
    
    if (isActive) filter.isActive = isActive === 'true';
    if (cuisineType) filter.cuisineType = cuisineType;
    if (adminId) filter.adminId = adminId; // Filter by adminId if provided
    
    const restaurants = await Restaurant.find(filter);
    res.status(httpStatus.OK).send(restaurants);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Restaurant not found' });
    }
    res.status(httpStatus.OK).send(restaurant);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
    
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update restaurant',
      error: error.message
    });
  }
};

const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Restaurant not found' });
    }
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();
    res.status(httpStatus.OK).send(restaurant);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Restaurant not found' });
    }
    // Also delete all menu items associated with this restaurant
    await MenuItem.deleteMany({ restaurant: req.params.id });
    res.status(httpStatus.OK).send({ 
      message: 'Restaurant and associated menu items deleted successfully' 
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getRestaurantByAdmin = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId: req.params.adminId });
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        error: 'Restaurant not found for this admin' 
      });
    }
    return res.status(200).json({ 
      success: true,
      data: restaurant 
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};



module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  toggleRestaurantStatus,
  deleteRestaurant, 
  getRestaurantByAdmin,
};