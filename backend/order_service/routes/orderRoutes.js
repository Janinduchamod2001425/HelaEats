// routes/orderRoutes.js
import express from "express";
import {
  confirmOrder,
  getOrderHistory,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/confirm", confirmOrder);
router.get("/history", getOrderHistory);

export default router;
