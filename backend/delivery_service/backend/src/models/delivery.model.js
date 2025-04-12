import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    deliveryPersonId: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: [Number],
    },
    dropLocation: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: [Number],
    },
    status: {
        type: String,
        enum: ["assigned", "accepted", "on_the_way", "delivered", "cancelled"],
        default: "assigned"
    }
}, {
    timestamps: true
});

// Create a 2dsphere index on the pickupLocation and dropLocation fields
deliverySchema.index({pickupLocation: "2dsphere"});
deliverySchema.index({dropLocation: "2dsphere"});

// Export the Delivery model
export default mongoose.model("Delivery", deliverySchema);