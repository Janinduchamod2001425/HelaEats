import Delivery from "../models/delivery.model.js";
import {
  getAvailableDrivers,
  updateDriverStatus,
} from "../services/driver.service.js";
import { getOrderDetails } from "../services/order.service.js";
import { broadcastUpdate } from "../services/socket.service.js";

// Helper function to calculate distance between two locations (Haversine formula)
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Find the nearest driver to the pickup location
function findNearestDriver(drivers, pickupLocation) {
  if (!drivers.length || !pickupLocation?.coordinates) return null;

  const pickupCoords = pickupLocation.coordinates;

  // Calculate the distance for each driver and find the nearest one
  const driversWithDistance = drivers
    .map((driver) => {
      if (!driver.location?.coordinates) return null;

      const distance = calculateDistance(
        pickupCoords,
        driver.location.coordinates,
      );
      return { ...driver, distance };
    })
    .filter(Boolean); // Remove any invalid drivers

  if (!driversWithDistance.length) return null;

  // Sort drivers by distance and return the nearest one
  return driversWithDistance.sort((a, b) => a.distance - b.distance)[0];
}

// Assign a delivery to a driver
export const assignDelivery = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Get order details from order service
    const order = await getOrderDetails(orderId);

    // Get available drivers from auth service
    const availableDrivers = await getAvailableDrivers();

    // Get the nearest driver to the pickup location
    const nearestDriver = findNearestDriver(
      availableDrivers,
      order.pickupLocation,
    );

    // Check if a driver is available
    if (!nearestDriver) {
      return res.status(404).json({ message: "No available drivers found" });
    }

    // Create a new delivery
    const newDelivery = new Delivery({
      customerId: order.customerId,
      orderId: order._id,
      restaurantId: order.restaurantId,
      deliveryPersonId: nearestDriver._id,
      pickupLocation: order.pickupLocation,
      dropLocation: order.dropLocation,
      status: "assigned",
      estimatedTimes: {
        preparation: 15, // Default values (minutes)
        transit: 25,
        delivery: 10,
      },
    });

    // Save the delivery to the database
    await newDelivery.save();

    // Update driver status to "on the delivery"
    await updateDriverStatus(nearestDriver._id, "on_delivery");

    // Broadcast the delivery assignment to the driver
    broadcastUpdate(orderId, {
      status: "assigned",
      progress: newDelivery.progress,
      driver: {
        name: nearestDriver.name,
        contact: nearestDriver.contact,
      },
      estimatedDelivery: calculateETA(newDelivery),
    });

    return res.status(201).json({
      message: "Delivery assigned successfully",
      delivery: newDelivery,
      assignedDriver: {
        id: nearestDriver._id,
        name: nearestDriver.name,
        distance: nearestDriver.distance.toFixed(2) + " km",
      },
    });
  } catch (error) {
    console.error("Error assigning delivery controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update the delivery status
export const updateDeliveryStatus = async (req, res) => {
  const { deliveryId } = req.params;
  const { status } = req.body;

  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: deliveryId, deliveryPersonId: req.user._id },
      {
        status,
        $push: { checkpoints: { phase: status } },
        lastUpdated: new Date(),
      },
      { new: true },
    );

    if (!delivery) {
      return res
        .status(404)
        .json({ message: "Delivery not found or unauthorized" });
    }

    // Broadcast update to customer
    broadcastUpdate(delivery.orderId, {
      status,
      progress: delivery.progress,
      lastCheckpoint: delivery.checkpoints.slice(-1)[0],
      estimatedDelivery: calculateETA(delivery),
    });

    // Notify Auth service when delivery is completed
    if (status === "delivered" || status === "cancelled") {
      await updateDriverStatus(req.user._id, "available");
    }

    res.json({ message: "Delivery status updated", delivery });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Helper function to calculate estimated time of arrival (ETA)
function calculateETA(delivery) {
  const remainingPhases = {
    preparing: delivery.estimatedTimes.preparation,
    assigned: 5, // Short time to accept
    accepted: delivery.estimatedTimes.transit,
    on_the_way: delivery.estimatedTimes.transit * 0.6,
    nearby: delivery.estimatedTimes.delivery,
  };
  return new Date(Date.now() + remainingPhases[delivery.status] * 60000);
}

// Get delivery status (for customer)
export const getDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      _id: req.params.deliveryId,
      $or: [{ customerId: req.user._id }, { deliveryPersonId: req.user._id }],
    }).select("-__v");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json({
      status: delivery.status,
      progress: delivery.progress,
      estimatedDelivery: calculateETA(delivery),
      driver: delivery.deliveryPersonId
        ? await getDriverDetails(delivery.deliveryPersonId)
        : null,
      checkpoints: delivery.checkpoints,
    });
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    res.status(500).json({ message: "Failed to fetch delivery status" });
  }
};

// Cancel delivery
export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      {
        _id: req.params.deliveryId,
        customerId: req.user._id,
        status: { $nin: ["delivered", "cancelled"] },
      },
      { status: "cancelled" },
      { new: true },
    );

    if (!delivery) {
      return res
        .status(404)
        .json({ message: "Delivery not found or already cancelled" });
    }

    // Notify the driver
    broadcastUpdate(delivery.orderId, {
      status: "cancelled",
      progress: 100,
    });

    if (delivery.deliveryPersonId) {
      await updateDriverStatus(delivery.deliveryPersonId, "available");
    }

    res.json({ message: "Delivery cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling delivery:", error);
    res.status(500).json({ message: "Failed to cancel delivery" });
  }
};
