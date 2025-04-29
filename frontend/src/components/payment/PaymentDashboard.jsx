import React, { useState, useEffect } from "react";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import { axiosPaymentInstance } from "../../lib/axios";
import { FiDownload, FiExternalLink } from "react-icons/fi";

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0,
  });
  const { restaurant } = useRestaurantStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant?._id) {
      fetchPayments();
      fetchStats();
    }
  }, [restaurant]);

  const fetchPayments = async () => {
    try {
      const response = await axiosPaymentInstance.get(
        `/api/payment/restaurant/${restaurant._id}`
      );
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  //add the fetchStats function:
  const fetchStats = async () => {
    try {
      const response = await axiosPaymentInstance.get(
        `/api/payment/restaurant/${restaurant._id}/stats`
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
    }
  };

  // handle stripe riderect
  const handleStripeRedirect = () => {
    window.open("https://dashboard.stripe.com/test/payments", "_blank");
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold">
              Rs. {stats.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Average Order</h3>
            <p className="text-2xl font-bold">
              Rs. {stats.averageOrder.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Payment History</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <FiDownload /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rs. {payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleStripeRedirect}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiExternalLink />
            Open Stripe Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
