import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Database connection
import {connectDB} from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database before start the server
connectDB().then(r => {
    console.log("✅ Database Connected!");
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded data

// Routes

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
})