import Delivery from "../models/delivery.model.js";
import {getAvailableDrivers, updateDriverStatus} from "../services/driver.service.js";
import {getOrderDetails} from "../services/order.service.js";

// Helper function to calculate distance between two locations (Haversine formula)
function calculateDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

function findNearestDriver(drivers, pickupLocation) {
    if (!drivers.length || !pickupLocation?.coordinates) return null;

    const pickupCoords = pickupLocation.coordinates;

    // Calculate the distance for each driver and find the nearest one
    const driversWithDistance = drivers.map(driver => {
        if (!driver.location?.coordinates) return null;

        const distance = calculateDistance(
            pickupCoords,
            driver.location.coordinates
        );
        return {...driver, distance};
    }).filter(Boolean); // Remove any invalid drivers

    if (!driversWithDistance.length) return null;

    // Sort drivers by distance and return the nearest one
    return driversWithDistance.sort((a, b) => a.distance - b.distance)[0];
}

export const assignDelivery = async (req, res) => {
    const {orderId} = req.body;

    try {
        // Get order details from order service
        const order = await getOrderDetails(orderId);

        // Get available drivers from auth service
        const availableDrivers = await getAvailableDrivers();

        const nearestDriver = findNearestDriver(availableDrivers, order.pickupLocation);

        if (!nearestDriver) {
            return res.status(404).json({message: "No available drivers found"});
        }

        // Create a new delivery
        const newDelivery = new Delivery({
            customerId: order.customerId,
            orderId,
            restaurantId: order.restaurantId,
            deliveryPersonId: nearestDriver._id,
            pickupLocation: order.pickupLocation,
            dropLocation: order.dropLocation,
            status: "assigned"
        });

        // Save the delivery to the database
        await newDelivery.save();

        // Update driver status to "on the delivery"
        await updateDriverStatus(nearestDriver._id, "on_delivery");

        return res.status(201).json({
            message: "Delivery assigned successfully",
            delivery: newDelivery,
            assignedDriver: {
                id: nearestDriver._id,
                name: nearestDriver.name,
                distance: nearestDriver.distance.toFixed(2) + " km"
            }
        });

    } catch (error) {
        console.error("Error assigning delivery controller:", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};


// Update the delivery status
export const updateDeliveryStatus = async (req, res) => {
    const {deliveryId} = req.params;
    const {status} = req.body;

    try {
        const delivery = await Delivery.findOneAndUpdate(
            {_id: deliveryId, deliveryPersonId: req.user._id},
            {status},
            {new: true}
        );

        if (!delivery) {
            return res.status(404).json({message: "Delivery not found or unauthorized"});
        }

        // Notify Auth service when delivery is completed
        if (status === "delivered" || status === "cancelled") {
            await updateDriverStatus(req.user._id, "available");
        }

        res.json({message: "Delivery status updated", delivery});
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({message: "Failed to update status"});
    }
};

