// controllers/orderController.js
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import { v4 as uuidv4 } from "uuid";

export const confirmOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.baskets.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.baskets.reduce((total, basket) => {
      const basketTotal = basket.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
      return total + basketTotal;
    }, 0);

    const newOrder = new Order({
      userId,
      orderId: uuidv4(),
      baskets: cart.baskets,
      totalAmount,
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
  const userId = req.query.userId || req.body.userId;

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
