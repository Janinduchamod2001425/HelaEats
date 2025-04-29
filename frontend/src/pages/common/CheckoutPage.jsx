
import { useCartStore } from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { axiosOrderInstance, axiosPaymentInstance } from "../../lib/axios";
import axios from "axios";
import { useState } from "react";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmOrderAndPay = async () => {
    try {
      setIsProcessing(true);

      // Calculate total with precise decimal handling
      const cartTotal = cart
        .reduce((total, item) => {
          const price = parseFloat(item.price);
          const quantity = parseInt(item.quantity);
          return total + price * quantity;
        }, 0)
        .toFixed(2);

      // Debug logging
      console.log("Cart calculation details:", {
        items: cart.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          subtotal: parseFloat(item.price) * parseInt(item.quantity),
        })),
        total: cartTotal,
      });

      // First confirm order
      const confirmRes = await axiosOrderInstance.post("/api/order/confirm");
      console.log("Order confirmation response:", confirmRes.data);

      if (!confirmRes.data.order) {
        throw new Error("No order data received");
      }

      const orderId = confirmRes.data.order.orderId;
      const backendTotal = parseFloat(
        confirmRes.data.order.totalAmount
      ).toFixed(2);

      // Compare totals with exact decimal match
      if (cartTotal !== backendTotal) {
        console.error("Amount mismatch:", {
          frontendTotal: cartTotal,
          backendTotal: backendTotal,
          difference: Math.abs(
            parseFloat(cartTotal) - parseFloat(backendTotal)
          ),
        });

        // Clear inconsistent cart state
        await clearCart();
        throw new Error("Cart total mismatch - please try again");
      }

      // Initialize payment
      const payRes = await axiosPaymentInstance.post("/api/payment/pay", {
        orderId: orderId,
      });

      if (payRes.data.url) {
        window.location.href = payRes.data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.itemId} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">Rs. {item.price * item.quantity}</p>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>Rs. {total}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/cart")}
          className="px-6 py-2 text-gray-600 border rounded hover:bg-gray-50"
        >
          Back to Cart
        </button>
        <button
          onClick={confirmOrderAndPay}
          disabled={isProcessing || cart.length === 0}
          className="flex-1 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
