import axios from "axios";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:5003";

// Interface for Get Order Details from Order Service to Delivery Service
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/api/orders/${orderId}/delivery-info`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    throw new Error("Could not fetch order details");
  }
};
