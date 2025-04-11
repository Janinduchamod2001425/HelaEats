import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());

//Routes
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

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
