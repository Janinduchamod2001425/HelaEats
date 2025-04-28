// routes/orderRoutes.js
import express from "express";
import {
  confirmOrder,
  getOrderHistory,
  getOrderStatus,
  getOrderById,
  updateOrderStatus,
  getRestaurantOrders,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/confirm", verifyToken, confirmOrder);
router.get("/history", verifyToken, getOrderHistory);
router.get("/status/:orderId", verifyToken, getOrderStatus);
router.patch("/:orderId/status", verifyToken, updateOrderStatus);
router.get("/:orderId", verifyToken, getOrderById);
router.get("/restaurant/:restaurantId", verifyToken, getRestaurantOrders);

export default router;
