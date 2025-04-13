import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Database connection
import {connectDB} from "./lib/db.js";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import driverRoutes from "./routes/driver.route.js";
import {errorHandler} from "./middleware/error.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to the database before start the server
connectDB().then(r => {
    console.log("✅ Auth Database Connected!");
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded data
app.use(errorHandler); // Apply global error handler

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
})