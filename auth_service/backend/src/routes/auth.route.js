import express from "express";
import {signUpCustomers, signUpOtherRoles} from "../controllers/auth.controller.js";
import {protectRoute, protectSystemAdminRoutes} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup/customer", signUpCustomers);
router.post("/signup/admin", protectRoute, protectSystemAdminRoutes, signUpOtherRoles);

export default router;
