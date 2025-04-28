const httpStatus = require("http-status");
const MenuItem = require("../models/menuItem.model");

const createMenuItem = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.restaurant) {
      return res.status(400).json({
        error: "Name, price and restaurant are required",
      });
    }

    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category || "Main Course",
      isAvailable: req.body.isAvailable !== false,
      preparationTime: parseInt(req.body.preparationTime) || 15,
      restaurant: req.body.restaurant,
      imageUrl: req.body.imageUrl,
      isVegetarian: req.body.isVegetarian || false,
      isVegan: req.body.isVegan || false,
      isGlutenFree: req.body.isGlutenFree || false,
    });

    await menuItem.save();
    return res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(400).json({
      error: error.message || "Failed to create menu item",
    });
  }
};
const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { isAvailable, category } = req.query;
    const filter = { restaurant: req.params.restaurantId };

    if (isAvailable) filter.isAvailable = isAvailable === "true";
    if (category) filter.category = category;

    const menuItems = await MenuItem.find(filter);
    return res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// const getMenuItemById = async (req, res) => {
//   try {
//     const menuItem = await MenuItem.findById(req.params.id);
//     if (!menuItem) {
//       return res.status(httpStatus.NOT_FOUND).send({ message: 'Menu item not found' });
//     }
//     res.status(httpStatus.OK).send(menuItem);
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
//   }
// };

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};

const toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
        data: null,
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    const updatedItem = await menuItem.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating availability",
      data: null,
      error: error.message,
    });
  }
};
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
      error: error.message,
    });
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
