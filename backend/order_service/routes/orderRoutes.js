// routes/orderRoutes.js
import express from "express";
import {
  confirmOrder,
  getOrderHistory,
  getOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/confirm", confirmOrder);
router.get("/history", getOrderHistory);
router.get("/status/:orderId", getOrderStatus);
router.get("/:orderId", getOrderById);

export default router;
