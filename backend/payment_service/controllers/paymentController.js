import axios from "axios";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";

export const initiatePayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Fetch order details from order_service
    const { data: order } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/${orderId}`
    );
    if (!order || order.status === "paid") {
      return res.status(400).json({ message: "Invalid or already paid order" });
    }

    // Build PayHere payment URL
    const formUrl = new URL("https://sandbox.payhere.lk/pay/checkout");
    const formFields = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: process.env.RETURN_URL,
      cancel_url: process.env.CANCEL_URL,
      notify_url: process.env.NOTIFY_URL,
      order_id: order.orderId,
      items: `Order #${order.orderId}`,
      amount: order.totalAmount,
      currency: "LKR",
      first_name: "John",
      last_name: "Doe",
      email: "test@example.com",
      phone: "0712345678",
      address: "123 Main St",
      city: "Colombo",
    };

    Object.entries(formFields).forEach(([key, value]) =>
      formUrl.searchParams.append(key, value)
    );

    res.status(200).json({ paymentUrl: formUrl.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const payhereWebhook = async (req, res) => {
  const { order_id, payment_id, payhere_amount, status_code, payment_method } =
    req.body;

  try {
    if (status_code === "2") {
      const payment = new Payment({
        orderId: order_id,
        paymentId: payment_id,
        amount: payhere_amount,
        paymentMethod: payment_method,
        status: "success",
        paidAt: new Date(),
      });

      await payment.save();

      // Update order status in order_service
      await axios.patch(`${process.env.ORDER_SERVICE_URL}/${order_id}/status`, {
        status: "paid",
      });

      console.log(`✅ Payment success recorded for Order: ${order_id}`);
      res.status(200).send("OK");
    } else {
      console.log(`❌ Payment failed for Order: ${order_id}`);
      res.status(400).send("Payment failed");
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).send("Internal server error");
  }
};
