import axios from "axios";
import Cart from "../models/cart.js";

// call the restaurant_service
const RESTAURANT_SERVICE_URL =
  process.env.RESTAURANT_SERVICE_URL || "http://localhost:5005/api";

export const addItem = async (req, res) => {
  const { itemId, quantity, name, price, imageUrl } = req.body;
  const { restaurantId } = req.params;
  const userId = req.user._id;

  try {
    // Verify item exists in restaurant service
    const response = await axios.get(
      `${RESTAURANT_SERVICE_URL}/menu-items/${itemId}`
    );
    const menuItem = response.data.data || response.data; // Handle different response structures

    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({ message: "Item not found or unavailable" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        baskets: [
          {
            restaurantId,
            items: [
              {
                itemId,
                name: menuItem.name,
                quantity,
                price: menuItem.price,
                imageUrl: menuItem.imageUrl,
              },
            ],
          },
        ],
      });
    } else {
      const basketIndex = cart.baskets.findIndex(
        (b) => b.restaurantId === restaurantId
      );

      if (basketIndex === -1) {
        cart.baskets.push({
          restaurantId,
          items: [
            {
              itemId,
              name: menuItem.name,
              quantity,
              price: menuItem.price,
              imageUrl: menuItem.imageUrl,
            },
          ],
        });
      } else {
        const existingItem = cart.baskets[basketIndex].items.find(
          (i) => i.itemId === itemId
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.baskets[basketIndex].items.push({
            itemId,
            name: menuItem.name,
            quantity,
            price: menuItem.price,
            imageUrl: menuItem.imageUrl,
          });
        }
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Cart operation error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { restaurantId, itemId } = req.params;
    const userId = req.user._id;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Find the cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the basket
    const basketIndex = cart.baskets.findIndex(
      (b) => b.restaurantId === restaurantId
    );
    if (basketIndex === -1) {
      return res.status(404).json({ message: "Restaurant basket not found" });
    }

    // Find the item
    const itemIndex = cart.baskets[basketIndex].items.findIndex(
      (i) => i.itemId === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity
    cart.baskets[basketIndex].items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete item from basket
export const deleteItem = async (req, res) => {
  // const { userId } = req.body;
  // const { restaurantId, itemId } = req.params;
  const { restaurantId, itemId } = req.params;
  const userId = req.user._id; // get userId from authenticate user

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
  // const userId = req.query.userId || req.body.userId || req.headers["user-id"];
  const userId = req.user._id; // Get userId from authenticated user

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in request" });
  }

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
  // const { userId } = req.body;
  const userId = req.user._id; // Get userId from authenticated user

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
