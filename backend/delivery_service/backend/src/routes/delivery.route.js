import express from "express";
import {
    assignDelivery,
    cancelDelivery,
    getDeliveryStatus,
    updateDeliveryStatus
} from "../controllers/delivery.controller.js";
import {validateStatusUpdate} from "../middleware/status.middleware.js";

const router = express.Router();

router.post('/assign', assignDelivery);
router.patch("/:deliveryId/status", validateStatusUpdate, updateDeliveryStatus);
router.get("/:deliveryId", getDeliveryStatus);
router.patch("/:deliveryId/cancel", cancelDelivery);

export default router;
