import Delivery from "../models/delivery.model.js";
import {getAvailableDrivers, updateDriverStatus} from "../utils/driver.service.js";

export const assignDelivery = async (req, res) => {
    const {orderId, restaurantId, pickupLocation, dropLocation} = req.body;

    try {
        // Get available drivers from auth service
        const availableDrivers = await getAvailableDrivers();

        const nearestDriver = findNearestDriver(availableDrivers, pickupLocation);

        if (!nearestDriver) {
            return res.status(404).json({message: "No available drivers found"});
        }

        // Create a new delivery
        const newDelivery = new Delivery({
            customerId: req.user._id,
            orderId,
            restaurantId,
            deliveryPersonId: nearestDriver._id,
            pickupLocation,
            dropLocation,
            status: "assigned"
        });

        // Save the delivery to the database
        await newDelivery.save();

        // Update driver status to "on the delivery"
        await updateDriverStatus(nearestDriver._id, "");

        return res.status(201).json({
            message: "Delivery assigned successfully",
            delivery: newDelivery,
            assignedDriver: {
                id: nearestDriver._id,
                distance: nearestDriver.distance
            }
        });

    } catch (error) {
        console.error("Error assigning delivery controller:", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

function findNearestDriver(drivers, pickupLocation) {

}

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

