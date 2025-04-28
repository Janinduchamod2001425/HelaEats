// import { useCartStore } from "../../store/useCartStore";
// import axios from "axios";

// export default function CheckoutPage() {
//   const cart = useCartStore((state) => state.cart);
//   const clearCart = useCartStore((state) => state.clearCart);

//   const confirmOrderAndPay = async () => {
//     try {
//       const userId = "user123";

//       // 1️⃣ Push frontend cart to backend cart
//       for (let item of cart) {
//         await axios.post(
//           `http://localhost:5003/api/cart/${item.restaurantId}/items`,
//           {
//             userId,
//             itemId: item.itemId,
//             quantity: item.quantity,
//           }
//         );
//       }

//       // 2️⃣ Now confirm order
//       const confirmRes = await axios.post(
//         "http://localhost:5003/api/order/confirm",
//         {
//           userId,
//         }
//       );

//       const orderId = confirmRes.data.order.orderId;
//       console.log("🧾 Confirmed Order:", orderId);

//       // 3️⃣ Start payment
//       const payRes = await axios.post("http://localhost:5004/api/payment/pay", {
//         orderId,
//       });

//       console.log("🔗 Payment URL:", payRes.data.paymentUrl);

//       clearCart(); // clear Zustand cart
//       // window.location.href = payRes.data.paymentUrl;
//       window.location.replace(payRes.data.paymentUrl);
//     } catch (err) {
//       console.error("🚨 Payment Error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Checkout</h1>
//       <ul>
//         {cart.map((item) => (
//           <li key={item.itemId}>
//             {item.name} - Rs. {item.price} x {item.quantity}
//           </li>
//         ))}
//       </ul>
//       <button
//         onClick={confirmOrderAndPay}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Confirm Order & Pay
//       </button>
//     </div>
//   );
// }

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

      // Calculate total before payment
      const cartTotal = parseFloat(
        cart.reduce(
          (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
          0
        )
      ).toFixed(2);
      console.log("frontend cart total:", cartTotal); // Debug log

      // Push cart to backend
      // for (let item of cart) {
      //   await axiosOrderInstance.post(`/api/cart/${item.restaurantId}/items`, {
      //     itemId: item.itemId,
      //     quantity: item.quantity,
      //     name: item.name,
      //     price: parseFloat(item.price),
      //   });
      // }

      // Confirm order
      const confirmRes = await axiosOrderInstance.post("/api/order/confirm");

      const orderId = confirmRes.data.order.orderId;

      // Verify the amounts match
      if (
        parseFloat(cartTotal) !== parseFloat(confirmRes.data.order.totalAmount)
      ) {
        console.error("Amount mismatch:", {
          frontendTotal: cartTotal,
          backendTotal: confirmRes.data.order.totalAmount,
        });
        throw new Error("Cart total mismatch");
      }

      // Initialize payment
      const payRes = await axiosPaymentInstance.post("/api/payment/pay", {
        orderId,
        withCredentials: true,
        // amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });

      // Remove strict amount verification since Stripe handles cents differently
      if (payRes.data.url) {
        await clearCart();
        window.location.href = payRes.data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.response?.data?.message || "Something went wrong");
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
