import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const port = process.env.PORT || 3002;
const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/api/payment", paymentRoutes);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
