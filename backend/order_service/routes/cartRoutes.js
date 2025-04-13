import express from "express";
import {
  addItem,
  updateItem,
  deleteItem,
  getCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/:restaurantId/items", addItem);
router.put("/:restaurantId/items/:itemId", updateItem);
router.delete("/:restaurantId/items/:itemId", deleteItem);
router.get("/", getCart);
router.delete("/", clearCart);

export default router;
