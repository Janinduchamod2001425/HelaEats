import express from "express";
import {
  initiatePayment,
  payhereWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/pay", initiatePayment); // Called by frontend
router.post(
  "/webhook",
  express.urlencoded({ extended: false }),
  payhereWebhook
); // Called by PayHere

export default router;
