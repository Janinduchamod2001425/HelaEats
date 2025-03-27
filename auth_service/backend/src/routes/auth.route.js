import express from "express";
import {signUpCustomers} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpCustomers);

export default router;
