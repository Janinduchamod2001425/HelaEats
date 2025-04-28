import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import RestaurantOrdersTable from "../../components/order/RestaurantOrderTable";
import { axiosOrderInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const RestaurantOrdersPage = () => {
  const { authUser } = useAuthStore();
  const { restaurant } = useRestaurantStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (restaurant?._id) {
          const response = await axiosOrderInstance.get(
            `/api/order/restaurant/${restaurant._id}`
          );
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurant]);

  const handleViewDetails = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
      // You can either show a modal here or navigate to a details page
      toast.success(`Viewing Order ${orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <RestaurantOrdersTable
              orders={orders}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrdersPage;
