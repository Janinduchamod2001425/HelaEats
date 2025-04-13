import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {getAvailableDrivers, updateDriverStatus} from "../controllers/driver.controller.js";

const router = express.Router();

router.get("/available", protectRoute, getAvailableDrivers);
router.patch("/:id/status", protectRoute, updateDriverStatus);

export default router;