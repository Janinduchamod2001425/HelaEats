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

    const restaurantId = order.baskets?.[0]?.restaurantId;
    if (!restaurantId) {
      return res
        .status(400)
        .json({ message: "Restaurant ID not found in order" });
    }

    // Enhanced amount validation and conversion
    const rawAmount = parseFloat(order.totalAmount);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      console.error("Invalid order amount:", order.totalAmount);
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // Round amount to 2 decimal places to avoid floating point issues
    const amount = rawAmount.toFixed(2);
    const unitAmount = Math.round(parseFloat(amount) * 100);

    // Add validation to catch discrepancies
    // Detailed logging for debugging
    console.log({
      orderId,
      originalAmount: order.totalAmount,
      processedAmount: amount,
      stripeAmount: unitAmount,
    });

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
            unit_amount: unitAmount, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: process.env.CANCEL_URL,
    });

    // Final validation before saving
    if (unitAmount !== Math.round(parseFloat(amount) * 100)) {
      console.error("Amount mismatch detected:", {
        originalAmount: amount,
        stripeAmount: unitAmount,
      });
      return res.status(400).json({ message: "Amount validation failed" });
    }

    // Save payment record
    const payment = new Payment({
      orderId: order.orderId,
      userId: req.user._id,
      amount: parseFloat(amount),
      stripeSessionId: session.id,
      paymentId: `temp_${session.id}`,
      paymentMethod: "stripe",
      status: "pending",
      currency: "lkr",
      metadata: {
        restaurantId: restaurantId,
        orderType: "food_delivery",
      },
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

// kalin eka

export const checkPaymentStatus = async (req, res) => {
  const { sessionId, orderId } = req.query;

  try {
    console.log("Checking payment status:", { sessionId, orderId }); // Debug log

    // Get token from request cookies
    const token = req.cookies.jwt;

    // First check in our database
    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
      orderId: orderId,
    });

    if (payment && payment.status === "success") {
      // Update order status
      try {
        // Fixed URL path
        const response = await axios.patch(
          `${process.env.ORDER_SERVICE_URL}/${orderId}/status`,
          { status: "confirmed" },
          {
            headers: {
              "Content-Type": "application/json",

              // Add cookie with JWT token
              Cookie: `jwt=${token}`,
            },
            withCredentials: true,
          }
        );

        await axios.delete(`${process.env.ORDER_SERVICE_URL}/api/cart`, {
          headers: {
            Cookie: `jwt=${token}`,
          },
          withCredentials: true,
        });

        console.log("Order status update response:", response.data);
      } catch (error) {
        console.error("Error updating order status:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url, // Add this to debug the URL
        });
      }
      return res.json({ success: true, status: "success" });
    }

    // If not found or not successful in our DB, check with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session:", session.payment_status);

    if (session.payment_status === "paid") {
      // Update our database
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

      // Update order status with fixed URL path
      try {
        const response = await axios.patch(
          `${process.env.ORDER_SERVICE_URL}/${orderId}/status`,
          { status: "confirmed" },
          {
            headers: {
              "Content-Type": "application/json",
              // Add cookie with JWT token here too
              Cookie: `jwt=${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Order status update response:", response.data);
      } catch (error) {
        console.error("Error updating order status:", error);
      }

      return res.json({ success: true, status: "success" });
    }

    res.json({ success: false, status: session.payment_status });
  } catch (err) {
    console.error("Payment status check error:", err);
    res.status(500).json({ error: err.message });
  }
};

// get restaurant payments

export const getRestaurantPayments = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    const query = {
      "metadata.restaurantId": restaurantId,
    };

    // Add date filtering if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 payments for performance

    res.json(payments);
  } catch (error) {
    console.error("Error fetching restaurant payments:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRestaurantPaymentStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { period } = req.query; // 'daily', 'weekly', 'monthly'

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "daily":
        dateFilter = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
        };
        break;
      case "weekly":
        dateFilter = {
          $gte: new Date(now.setDate(now.getDate() - 7)),
        };
        break;
      case "monthly":
      default:
        dateFilter = {
          $gte: new Date(now.setMonth(now.getMonth() - 1)),
        };
    }

    const stats = await Payment.aggregate([
      {
        $match: {
          "metadata.restaurantId": restaurantId,
          status: "success",
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          averageOrder: { $avg: "$amount" },
        },
      },
    ]);

    const response = stats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrder: 0,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    res.status(500).json({ error: error.message });
  }
};
