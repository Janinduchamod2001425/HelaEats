import Auth from "../models/auth.model.js";

export const getAvailableDrivers = async (req, res) => {
    try {
        // Find all delivery personnel with status "available"
        const drivers = await Auth.find({
            role: "delivery_personnel",
            status: "available"
        }).select(" _id name contact vehicleNumber location");

        // Format the location data for easier consumption
        const formattedDrivers = drivers.map(driver => ({
            _id: driver._id,
            name: driver.name,
            contact: driver.contact,
            vehicleNumber: driver.vehicleNumber,
            location: driver.location // GeoJSON format { type: 'Point', coordinates: [lng, lat] }
        }));

        // Send the formatted driver data as a response
        res.status(200).json(formattedDrivers);
    } catch (error) {
        console.log("Error in getAvailableDrivers controller: ", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Controller for updating driver status
export const updateDriverStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    try {
        // Validate status
        if (!['available', 'on_delivery', 'offline'].includes(status)) {
            return res.status(400).json({message: "Invalid status value"});
        }

        // Validate Driver ID
        if (!id) {
            return res.status(400).json({message: "Driver ID required"});
        }

        // Find and update the driver status
        const driver = await Auth.findOneAndUpdate(
            {
                _id: id,
                role: 'delivery_personnel' // Ensure we're only updating delivery personnel
            },
            {status},
            {new: true}
        ).select('_id name status');

        // Check if the driver was found
        if (!driver) {
            return res.status(404).json({message: "Driver not found"});
        }

        // Send success response
        res.status(200).json({
            message: "Driver status updated successfully",
            driver: {
                _id: driver._id,
                name: driver.name,
                status: driver.status
            }
        });

        // Handle any errors that occur during the process
    } catch (error) {
        console.log("Error in updateDriverStatus controller: ", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}