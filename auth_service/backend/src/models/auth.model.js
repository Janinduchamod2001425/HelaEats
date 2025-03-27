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
            required: function () {
                return this.role === "customer";
            },
        },
        address: {
            type: String,
            required: function () {
                return this.role === "customer";
            },
        },
        role: {
            type: String,
            enum: ["system_admin", "restaurant_admin", "delivery_personnel", "customer"],
            default: "customer",
        },
        restaurantId: {
            type: String,
            required: function () {
                return this.role === "restaurant_admin";
            }
        },
        vehicleNumber: {
            type: String,
            required: function () {
                return this.role === "delivery_personnel";
            }
        },
    }, {
        timestamps: true,
    }
);

export default mongoose.model("Auth", authSchema);


