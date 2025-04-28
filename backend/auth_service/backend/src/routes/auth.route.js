import express from "express";
import {
  checkAuth,
  completeProfile,
  getProfile,
  login,
  logout,
  signUp,
  getUserById,
} from "../controllers/auth.controller.js";
import {
  protectRoute,
  protectSystemAdminRoutes,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/admin/signup", protectRoute, protectSystemAdminRoutes, signUp); // Admin signup route
router.post("/login", login);
router.post("/logout", logout);
router.patch("/complete-profile", protectRoute, completeProfile);
router.get("/profile", protectRoute, getProfile);
router.get("/check", protectRoute, checkAuth);
router.get("/user/:userId", protectRoute, getUserById); // Add this new route

export default router;
