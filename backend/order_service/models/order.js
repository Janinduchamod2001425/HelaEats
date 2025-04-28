// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  quantity: Number,
  price: Number,
});

const restaurantBasketSchema = new mongoose.Schema({
  restaurantId: String,
  items: [orderItemSchema],
});

const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  baskets: [restaurantBasketSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ],
    default: "pending", // could be 'confirmed', 'paid', 'delivered'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
