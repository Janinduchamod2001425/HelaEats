import axios from "axios";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:5001";

// Interface for Get available Drivers Details from Auth Service to Delivery Service
export const getAvailableDrivers = async () => {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/api/drivers/available`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available drivers:", error.message);
    throw new Error("Could not fetch available drivers");
  }
};

// Interface for Update Driver Status in Auth Service After Delivery from Delivery Service
export const updateDriverStatus = async (driverId, status) => {
  try {
    const response = await axios.patch(
      `${AUTH_SERVICE_URL}/api/drivers/${driverId}/status`,
      { status },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating driver status:", error.message);
    throw new Error("Could not update driver status");
  }
};
