import express from "express";
import {
  initiatePayment,
  checkPaymentStatus,
  getRestaurantPayments,
  getRestaurantPaymentStats,
} from "../controllers/paymentController.js";
import Payment from "../models/Payment.js"; // Add this import
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Payment routes
router.post("/pay", verifyToken, initiatePayment);
router.get("/check-status", verifyToken, checkPaymentStatus);
router.get("/restaurant/:restaurantId", verifyToken, getRestaurantPayments);
router.get(
  "/restaurant/:restaurantId/stats",
  verifyToken,
  getRestaurantPaymentStats
);

// Get payment details
router.get("/status/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    res.json(payment || { status: "not_found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
