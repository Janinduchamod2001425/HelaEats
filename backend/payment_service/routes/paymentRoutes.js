// import express from "express";
// import {
//   initiatePayment,
//   payhereWebhook,
// } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/pay", initiatePayment); // Called by frontend
// router.post(
//   "/webhook",
//   express.urlencoded({ extended: false }),
//   payhereWebhook
// ); // Called by PayHere

// export default router;

import express from "express";
import {
  initiatePayment,
  checkPaymentStatus,
} from "../controllers/paymentController.js";
import Payment from "../models/Payment.js"; // Add this import
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Payment routes
router.post("/pay", verifyToken, initiatePayment);
router.get("/check-status", verifyToken, checkPaymentStatus);

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
