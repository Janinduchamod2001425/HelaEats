const httpStatus = require('http-status');
const Restaurant = require('../models/restaurant.model');
const MenuItem = require('../models/menuItem.model');


const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { isActive, cuisineType } = req.query;
    const filter = {};
    
    if (isActive) filter.isActive = isActive === 'true';
    if (cuisineType) filter.cuisineType = cuisineType;
    
    const restaurants = await Restaurant.find(filter);
    res.send(restaurants);
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
    res.send(restaurant);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Restaurant not found' });
    }
    res.send(restaurant);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
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
    res.send(restaurant);
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
    res.send({ message: 'Restaurant and associated menu items deleted successfully' });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  toggleRestaurantStatus,
  deleteRestaurant,
};