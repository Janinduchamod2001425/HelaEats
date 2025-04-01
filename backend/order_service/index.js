import express from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
