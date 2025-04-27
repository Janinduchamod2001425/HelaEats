import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ["system_admin", "restaurant_admin", "delivery_personnel", "customer"],
            required: true
        },
        restaurantId: {
            type: String,
            required: false,
        },
        vehicleNumber: {
            type: String,
            required: false,
        },
        // Only relevant for delivery_personnel
        status: {
            type: String,
            enum: ["available", "on_delivery", "offline"],
            required: false
        },
        // Geo location of delivery personnel
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: false
            },
            coordinates: {
                type: [Number],
                required: false
            }
        },
        // Track registration status
        isProfileComplete: {
            type: Boolean,
            default: false,
        }
    }, {
        timestamps: true,
    }
);

authSchema.index({location: "2dsphere"});

// Add pre-save hook to ensure role-specific fields are set later
authSchema.pre("save", function (next) {
    if (this.isProfileComplete) {
        // Validate fields based on a role when the profile is marked as complete
        const validationRules = {
            customer: () => {
                if (!this.contact || !this.address) throw new Error("Customer requires contact and address");
            },
            restaurant_admin: () => {
                if (!this.restaurantId || !this.contact) throw new Error("Restaurant admin requires restaurantId and contact");
            },
            delivery_personnel: () => {
                if (!this.vehicleNumber || !this.contact || !this.status || !this.location) throw new Error("Delivery personnel requires vehicleNumber, contact, Status and location");
            },
            system_admin: () => {
                if (!this.contact) throw new Error("System Admin requires contact");
            }
        };

        validationRules[this.role]?.();
    }
    next();
})

export default mongoose.model("Auth", authSchema);


