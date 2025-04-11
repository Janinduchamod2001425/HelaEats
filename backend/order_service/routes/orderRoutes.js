// routes/orderRoutes.js
import express from "express";
import { confirmOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/confirm", confirmOrder);

export default router;
