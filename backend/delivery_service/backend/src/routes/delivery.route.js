import express from "express";
import {assignDelivery, updateDeliveryStatus} from "../controllers/delivery.controller.js";

const router = express.Router();

router.post('/assign', assignDelivery);
router.patch("/:deliveryId/status", updateDeliveryStatus);

export default router;
