const httpStatus = require('http-status');
const MenuItem = require('../models/menuItem.model');

const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { isAvailable, category } = req.query;
    const filter = { restaurant: req.params.restaurantId };
    
    if (isAvailable) filter.isAvailable = isAvailable === 'true';
    if (category) filter.category = category;
    
    const menuItems = await MenuItem.find(filter);
    res.send(menuItems);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Menu item not found' });
    }
    res.send(menuItem);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Menu item not found' });
    }
    res.send(menuItem);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

const toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Menu item not found' });
    }
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    res.send(menuItem);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Menu item not found' });
    }
    res.send({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
};