import Cart from "../models/cart.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

// Load mock restaurant data
const mockData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "mock", "restaurants.json"))
);

// ✅ Add item to restaurant basket
export const addItem = async (req, res) => {
  const { userId, itemId, quantity } = req.body;
  const { restaurantId } = req.params;

  try {
    // Validate restaurant
    const restaurant = mockData.find((rest) => rest.id === restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Validate item
    const item = restaurant.items.find((i) => i.itemId === itemId);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in this restaurant" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, baskets: [] });

    let basket = cart.baskets.find((b) => b.restaurantId === restaurantId);
    if (!basket) {
      basket = { restaurantId, items: [] };
      cart.baskets.push(basket);
    }

    const existingItem = basket.items.find((i) => i.itemId === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      basket.items.push({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json(cart);
    console.log("restaurantId:", restaurantId);
    console.log("itemId:", itemId);
    console.log("Found restaurant:", restaurant?.name);
    console.log("Found item:", item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update quantity of an item in basket
export const updateItem = async (req, res) => {
  const { userId, quantity } = req.body;
  const { restaurantId, itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const basket = cart.baskets.find((b) => b.restaurantId === restaurantId);
    if (!basket) return res.status(404).json({ message: "Basket not found" });

    const item = basket.items.find((i) => i.itemId === itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete item from basket
export const deleteItem = async (req, res) => {
  const { userId } = req.body;
  const { restaurantId, itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const basket = cart.baskets.find((b) => b.restaurantId === restaurantId);
    if (!basket) return res.status(404).json({ message: "Basket not found" });

    basket.items = basket.items.filter((i) => i.itemId !== itemId);
    cart.baskets = cart.baskets.filter((b) => b.items.length > 0); // Clean up empty baskets

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get full cart (read-only)
export const getCart = async (req, res) => {
  const userId = req.body.userId || req.query.userId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Optional: Clear entire cart
export const clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
