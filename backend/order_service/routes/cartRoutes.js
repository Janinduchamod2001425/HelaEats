import express from "express";
import {
  addItem,
  updateItem,
  deleteItem,
  getCart,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.post("/:restaurantId/items", addItem);
// router.put("/:restaurantId/items/:itemId", updateItem);
// router.delete("/:restaurantId/items/:itemId", deleteItem);
// router.get("/", getCart);
// router.delete("/", clearCart);

router.post("/:restaurantId/items", verifyToken, addItem);
router.put("/:restaurantId/items/:itemId", verifyToken, updateItem);
router.delete("/:restaurantId/items/:itemId", verifyToken, deleteItem);
router.get("/", verifyToken, getCart);
router.delete("/", verifyToken, clearCart);

export default router;
