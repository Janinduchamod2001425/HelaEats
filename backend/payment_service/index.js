// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";

// import paymentRoutes from "./routes/paymentRoutes.js";

// dotenv.config();
// const port = process.env.PORT || 3002;
// const app = express();

// app.use(cors());
// app.use(express.json());

// //Routes
// app.use("/api/payment", paymentRoutes);

// // Connect to MongoDB Atlas
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // app.get("/", (req, res) => {
// //   res.send("Hello World");
// // });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Stripe from "stripe";

import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Debug log
const port = process.env.PORT || 3002;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Routes
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(port, () => {
  console.log(`✅ Payment Service running on port ${port}`);
});
