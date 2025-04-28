import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    customerId: {
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
        enum: ["preparing", "assigned", "accepted", "on_the_way", "nearby", "delivered", "cancelled"],
        default: "preparing"
    },
    // Tracking Fields
    checkpoints: [
        {
            phase: {
                type: String,
                enum: ["restaurant_departed", "zone_entered", "customer_area", "completed"],
                required: true
            },
            timeline: {
                type: Date,
                default: Date.now
            },
        }
    ],
    currentZone: {
        type: String,
        enum: ["restaurant", "transit", "customer_area"],
        default: "restaurant"
    },
    estimatedTimes: {
        preparation: Number,  // in minutes
        transit: Number,
        delivery: Number
    },
    lastUpdated: Date
}, {
    timestamps: true
});

// Add virtual for progress percentage
deliverySchema.virtual('progress').get(function () {
    const phaseWeights = {
        preparing: 0.15,
        assigned: 0.3,
        accepted: 0.4,
        on_the_way: 0.7,
        nearby: 0.9,
        delivered: 1,
        cancelled: 1
    };
    return Math.floor(phaseWeights[this.status] * 100);
});

// Create a 2dsphere index on the pickupLocation and dropLocation fields
deliverySchema.index({pickupLocation: "2dsphere"});
deliverySchema.index({dropLocation: "2dsphere"});
deliverySchema.index({status: 1});
deliverySchema.index({"checkpoints.timeline": 1});

// Export the Delivery model
export default mongoose.model("Delivery", deliverySchema);