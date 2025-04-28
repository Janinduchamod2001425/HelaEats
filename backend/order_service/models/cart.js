import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  quantity: Number,
  price: Number,
  imageUrl: String,
});

const basketSchema = new mongoose.Schema({
  restaurantId: String,
  items: [itemSchema],
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  baskets: [basketSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
