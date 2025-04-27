import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosPaymentInstance } from "../../lib/axios";
import axios from "axios";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");

        console.log("Verifying payment:", { sessionId, orderId }); // Debug log

        if (!sessionId || !orderId) {
          throw new Error("Missing payment information");
        }

        // Verify payment status
        const response = await axiosPaymentInstance.get(
          `/api/payment/check-status?sessionId=${sessionId}&orderId=${orderId}`
        );

        console.log("Payment verification response:", response.data); // Debug log

        // Check both success flag and payment status
        if (response.data.success || response.data.status === "success") {
          setStatus("success");
        } else {
          console.log("Payment not successful:", response.data); // Debug log
          setStatus("failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      {status === "checking" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Verifying Payment...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">Thank you for your order.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Return to Home
          </button>
        </div>
      )}

      {status === "failed" && (
        <div>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong with your payment.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
