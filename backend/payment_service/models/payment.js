// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   orderId: String,
//   userId: String,
//   amount: Number,
//   paymentId: String,
//   paymentMethod: String,
//   status: { type: String, default: "initiated" }, // 'success', 'failed'
//   paidAt: Date,
// });

// const Payment = mongoose.model("Payment", paymentSchema);
// export default Payment;

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "lkr",
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    paidAt: Date,
    refundedAt: Date,
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
