// // import axios from "axios";
// // import Payment from "../models/Payment.js";
// // import { v4 as uuidv4 } from "uuid";

// // export const initiatePayment = async (req, res) => {
// //   const { orderId } = req.body;

// //   try {
// //     // Fetch order details from order_service
// //     const { data: order } = await axios.get(
// //       `${process.env.ORDER_SERVICE_URL}/${orderId}`
// //     );
// //     if (!order || order.status === "paid") {
// //       return res.status(400).json({ message: "Invalid or already paid order" });
// //     }

// //     // Build PayHere payment URL
// //     const formUrl = new URL("https://sandbox.payhere.lk/pay/checkout");
// //     const formFields = {
// //       merchant_id: process.env.PAYHERE_MERCHANT_ID,
// //       return_url: process.env.RETURN_URL,
// //       cancel_url: process.env.CANCEL_URL,
// //       notify_url: process.env.NOTIFY_URL,
// //       order_id: order.orderId,
// //       items: `Order #${order.orderId}`,
// //       amount: order.totalAmount,
// //       currency: "LKR",
// //       first_name: "John",
// //       last_name: "Doe",
// //       email: "test@example.com",
// //       phone: "0712345678",
// //       address: "123 Main St",
// //       city: "Colombo",
// //     };

// //     Object.entries(formFields).forEach(([key, value]) =>
// //       formUrl.searchParams.append(key, value)
// //     );

// //     res.status(200).json({ paymentUrl: formUrl.toString() });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // export const payhereWebhook = async (req, res) => {
// //   const { order_id, payment_id, payhere_amount, status_code, payment_method } =
// //     req.body;

// //   try {
// //     if (status_code === "2") {
// //       const payment = new Payment({
// //         orderId: order_id,
// //         paymentId: payment_id,
// //         amount: payhere_amount,
// //         paymentMethod: payment_method,
// //         status: "success",
// //         paidAt: new Date(),
// //       });

// //       await payment.save();

// //       // Update order status in order_service
// //       await axios.patch(`${process.env.ORDER_SERVICE_URL}/${order_id}/status`, {
// //         status: "paid",
// //       });

// //       console.log(`✅ Payment success recorded for Order: ${order_id}`);
// //       res.status(200).send("OK");
// //     } else {
// //       console.log(`❌ Payment failed for Order: ${order_id}`);
// //       res.status(400).send("Payment failed");
// //     }
// //   } catch (err) {
// //     console.error("Webhook error:", err.message);
// //     res.status(500).send("Internal server error");
// //   }
// // };

// import axios from "axios";
// import Payment from "../models/Payment.js";
// import { v4 as uuidv4 } from "uuid";
// import crypto from "crypto";

// // ✅ Initiate Payment
// // export const initiatePayment = async (req, res) => {
// //   const { orderId } = req.body;

// //   try {
// //     // Fetch order details from order_service
// //     const { data: order } = await axios.get(
// //       `${process.env.ORDER_SERVICE_URL}/${orderId}`
// //     );

// //     if (!order || order.status === "paid") {
// //       return res.status(400).json({ message: "Invalid or already paid order" });
// //     }

// //     // Build PayHere payment URL
// //     const formUrl = new URL("https://sandbox.payhere.lk/pay/checkout");
// //     const formFields = {
// //       merchant_id: process.env.PAYHERE_MERCHANT_ID,
// //       return_url: process.env.RETURN_URL,
// //       cancel_url: process.env.CANCEL_URL,
// //       notify_url: process.env.NOTIFY_URL,
// //       order_id: order.orderId,
// //       items: `Order #${order.orderId}`,
// //       amount: order.totalAmount,
// //       currency: "LKR",
// //       first_name: "John",
// //       last_name: "Doe",
// //       email: "test@example.com",
// //       phone: "0712345678",
// //       address: "123 Main St",
// //       country: "Sri Lanka",
// //       city: "Colombo",
// //     };

// //     Object.entries(formFields).forEach(([key, value]) =>
// //       formUrl.searchParams.append(key, value)
// //     );

// //     res.status(200).json({ paymentUrl: formUrl.toString() });
// //   } catch (err) {
// //     console.error("Payment initiation error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // ✅ Webhook: Called by PayHere after payment
// // export const payhereWebhook = async (req, res) => {
// //   const { order_id, payment_id, payhere_amount, status_code, payment_method } =
// //     req.body;

// //   try {
// //     // Only continue if status is success (2)
// //     if (parseInt(status_code) === 2) {
// //       // Fetch order again to get userId
// //       const { data: order } = await axios.get(
// //         `${process.env.ORDER_SERVICE_URL}/${order_id}`
// //       );
// //       const userId = order.userId;

// //       // Check for duplicate payment (optional)
// //       const existing = await Payment.findOne({ paymentId: payment_id });
// //       if (existing) {
// //         return res.status(200).send("Payment already recorded");
// //       }

// //       // Save payment in DB
// //       const payment = new Payment({
// //         orderId: order_id,
// //         userId, // ✅ store userId here
// //         paymentId: payment_id,
// //         amount: payhere_amount,
// //         paymentMethod: payment_method,
// //         status: "success",
// //         paidAt: new Date(),
// //       });

// //       await payment.save();

// //       // Update order status to "paid"
// //       await axios.patch(`${process.env.ORDER_SERVICE_URL}/${order_id}/status`, {
// //         status: "paid",
// //       });

// //       console.log(`✅ Payment success recorded for Order: ${order_id}`);
// //       res.status(200).send("OK");
// //     } else {
// //       console.log(`❌ Payment failed for Order: ${order_id}`);
// //       res.status(400).send("Payment failed");
// //     }
// //   } catch (err) {
// //     console.error("Webhook error:", err.message);
// //     res.status(500).send("Internal server error");
// //   }
// // };

// // initial payment
// export const initiatePayment = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     // log
//     console.log("PAYHERE_MERCHANT_ID:", process.env.PAYHERE_MERCHANT_ID);
//     console.log("RETURN_URL:", process.env.RETURN_URL);
//     console.log("CANCEL_URL:", process.env.CANCEL_URL);
//     console.log("NOTIFY_URL:", process.env.NOTIFY_URL);
//     console.log("PAYHERE_SECRET:", process.env.PAYHERE_SECRET);

//     // Fetch order details from order_service
//     const { data: order } = await axios.get(
//       `${process.env.ORDER_SERVICE_URL}/${orderId}`
//     );

//     if (!order || order.status === "paid") {
//       return res.status(400).json({ message: "Invalid or already paid order" });
//     }

//     // Build PayHere payment URL
//     const formUrl = new URL("https://sandbox.payhere.lk/pay/checkout");
//     const formFields = {
//       merchant_id: process.env.PAYHERE_MERCHANT_ID,
//       return_url: process.env.RETURN_URL,
//       cancel_url: process.env.CANCEL_URL,
//       notify_url: process.env.NOTIFY_URL,
//       order_id: order.orderId,
//       items: `Order #${order.orderId}`,
//       amount: order.totalAmount.toFixed(2),
//       currency: "LKR",
//       first_name: "John", // Replace with actual user data
//       last_name: "Doe",
//       email: "test@example.com",
//       phone: "0712345678",
//       address: "123 Main St",
//       city: "Colombo",
//       country: "Sri Lanka",
//     };

//     // Generate the hash
//     const hashString =
//       process.env.PAYHERE_MERCHANT_ID +
//       formFields.order_id +
//       formFields.amount +
//       formFields.currency +
//       process.env.PAYHERE_SECRET;

//     const hash = crypto.createHash("md5").update(hashString).digest("hex");
//     formFields.hash = hash; // Add the hash to the form fields

//     // Append form fields to the URL
//     Object.entries(formFields).forEach(([key, value]) =>
//       formUrl.searchParams.append(key, value)
//     );

//     console.log("Generated Payment URL:", formUrl.toString()); // Log for debugging

//     res.status(200).json({ paymentUrl: formUrl.toString() });
//   } catch (err) {
//     console.error("Payment initiation error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// // payhere webhook
// export const payhereWebhook = async (req, res) => {
//   const {
//     order_id,
//     payment_id,
//     payhere_amount,
//     payhere_currency,
//     status_code,
//     payment_method,
//     hash, // Hash sent by PayHere
//   } = req.body;

//   try {
//     // Generate the hash using the formula
//     const generatedHash = crypto
//       .createHash("md5")
//       .update(
//         process.env.PAYHERE_MERCHANT_ID +
//           order_id +
//           payhere_amount +
//           payhere_currency +
//           status_code +
//           process.env.PAYHERE_SECRET
//       )
//       .digest("hex");

//     // Validate the hash
//     if (generatedHash !== hash) {
//       console.error("Invalid hash. Possible tampering detected.");
//       return res.status(400).send("Invalid request");
//     }

//     // Only continue if status is success (2)
//     if (parseInt(status_code) === 2) {
//       // Fetch order again to get userId
//       const { data: order } = await axios.get(
//         `${process.env.ORDER_SERVICE_URL}/${order_id}`
//       );
//       const userId = order.userId;

//       // Check for duplicate payment (optional)
//       const existing = await Payment.findOne({ paymentId: payment_id });
//       if (existing) {
//         return res.status(200).send("Payment already recorded");
//       }

//       // Save payment in DB
//       const payment = new Payment({
//         orderId: order_id,
//         userId, // ✅ store userId here
//         paymentId: payment_id,
//         amount: payhere_amount,
//         paymentMethod: payment_method,
//         status: "success",
//         paidAt: new Date(),
//       });

//       await payment.save();

//       // Update order status to "paid"
//       await axios.patch(`${process.env.ORDER_SERVICE_URL}/${order_id}/status`, {
//         status: "paid",
//       });

//       console.log(`✅ Payment success recorded for Order: ${order_id}`);
//       res.status(200).send("OK");
//     } else {
//       console.log(`❌ Payment failed for Order: ${order_id}`);
//       res.status(400).send("Payment failed");
//     }
//   } catch (err) {
//     console.error("Webhook error:", err.message);
//     res.status(500).send("Internal server error");
//   }
// };

// do not consider above code

import dotenv from "dotenv";
import Stripe from "stripe";
import Payment from "../models/Payment.js";
import axios from "axios";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initiatePayment = async (req, res) => {
  const { orderId } = req.body;
  const token = req.cookies.jwt;

  try {
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch order details with authentication
    const { data: order } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/${orderId}`,
      {
        headers: {
          Cookie: `jwt=${token}`,
        },
        withCredentials: true,
      }
    );
    if (!order || order.status === "paid") {
      return res.status(400).json({ message: "Invalid or already paid order" });
    }

    // Round amount to 2 decimal places to avoid floating point issues
    const amount = Math.round(order.totalAmount * 100) / 100;
    console.log("Processing amount:", amount); // Debug log

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Order #${order.orderId}`,
              description: `Total items: ${order.items?.length || 1}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: process.env.CANCEL_URL,
    });

    // Save payment record
    const payment = new Payment({
      orderId: order.orderId,
      userId: req.user._id,
      amount: order.totalAmount,
      stripeSessionId: session.id,
      paymentId: `temp_${session.id}`,
      paymentMethod: "stripe",
      status: "pending",
      currency: "lkr",
    });
    await payment.save();

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("Payment initiation error:", err);
    res.status(500).json({ error: err.message });
  }
};
// export const checkPaymentStatus = async (req, res) => {
//   const { sessionId, orderId } = req.query;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status === "paid") {
//       // Update payment record
//       await Payment.findOneAndUpdate(
//         { stripeSessionId: sessionId },
//         {
//           status: "success",
//           paymentId: session.payment_intent,
//           paidAt: new Date(),
//         }
//       );

//       // Update order status
//       await axios.patch(`${process.env.ORDER_SERVICE_URL}/${orderId}/status`, {
//         status: "paid",
//       });

//       return res.json({ success: true });
//     }

//     res.json({ success: false, status: session.payment_status });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const checkPaymentStatus = async (req, res) => {
  const { sessionId, orderId } = req.query;

  try {
    console.log("Checking payment status:", { sessionId, orderId }); // Debug log

    // First check in our database
    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
      orderId: orderId,
    });

    console.log("Payment record:", payment); // Debug log

    if (payment && payment.status === "success") {
      return res.json({ success: true, status: "success" });
    }

    // If not found or not successful in our DB, check with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session:", session.payment_status); // Debug log

    if (session.payment_status === "paid") {
      // Update our database if needed
      if (payment) {
        await Payment.findOneAndUpdate(
          { stripeSessionId: sessionId },
          {
            status: "success",
            paymentId: session.payment_intent,
            paidAt: new Date(),
          }
        );
      }

      return res.json({ success: true, status: "success" });
    }

    res.json({ success: false, status: session.payment_status });
  } catch (err) {
    console.error("Payment status check error:", err);
    res.status(500).json({ error: err.message });
  }
};
