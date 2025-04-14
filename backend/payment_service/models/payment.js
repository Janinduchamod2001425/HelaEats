import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  paymentId: String,
  paymentMethod: String,
  status: { type: String, default: "initiated" }, // 'success', 'failed'
  paidAt: Date,
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
