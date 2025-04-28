// controllers/orderController.js
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { v4 as uuidv4 } from "uuid";

// confirm the order
export const confirmOrder = async (req, res) => {
  // const { userId } = req.body;
  const userId = req.user._id; // Get userId from authenticated user

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.baskets.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total with precise decimal handling
    const totalAmount = cart.baskets.reduce((total, basket) => {
      const basketTotal = basket.items.reduce((sum, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        console.log(
          `Order calc - Item: ${
            item.name
          }, Price: ${price}, Qty: ${quantity}, Total: ${price * quantity}`
        );
        return sum + price * quantity;
      }, 0);
      return total + basketTotal;
    }, 0);

    // Format to 2 decimal places
    const formattedTotal = parseFloat(totalAmount.toFixed(2));

    console.log({
      calculatedTotal: totalAmount,
      formattedTotal: formattedTotal,
      basketsCount: cart.baskets.length,
      itemsCount: cart.baskets.reduce(
        (count, basket) => count + basket.items.length,
        0
      ),
    });

    const newOrder = new Order({
      userId,
      orderId: uuidv4(),
      baskets: cart.baskets,
      totalAmount: formattedTotal,
    });

    await newOrder.save();
    await Cart.deleteOne({ userId }); // clear cart after confirming

    res.status(201).json({
      message: "Order confirmed",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get order history
export const getOrderHistory = async (req, res) => {
  // const userId = req.query.userId || req.body.userId;
  const userId = req.user._id; // Get userId from authenticated user

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get order status
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      orderId: order.orderId,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET full order by orderId (for payment service)
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order); // return full order object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// display order details
export const getRestaurantOrders = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Find all orders that have baskets containing items from this restaurant
    const orders = await Order.find({
      "baskets.restaurantId": restaurantId,
    }).sort({ createdAt: -1 });

    // Filter out baskets from other restaurants
    const filteredOrders = orders.map((order) => ({
      ...order.toObject(),
      baskets: order.baskets.filter(
        (basket) => basket.restaurantId === restaurantId
      ),
    }));

    res.status(200).json({ orders: filteredOrders });
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({ error: err.message });
  }
};
