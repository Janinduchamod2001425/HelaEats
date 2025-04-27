// routes/orderRoutes.js
import express from "express";
import {
  confirmOrder,
  getOrderHistory,
  getOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/confirm", verifyToken, confirmOrder);
router.get("/history", verifyToken, getOrderHistory);
router.get("/status/:orderId", verifyToken, getOrderStatus);
router.get("/:orderId", verifyToken, getOrderById);

export default router;
