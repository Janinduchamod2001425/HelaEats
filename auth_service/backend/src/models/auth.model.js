import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

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

// Password hashing
authSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = bcrypt.getSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password comparison
authSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// (System admin initialization) Auto-create first system admin
authSchema.statics.createFirstSystemAdmin = async function () {
    if (process.env.NODE_ENV !== 'production') return;

    const systemAdminExists = await this.findOne({role: "system_admin"});

    if (!systemAdminExists && process.env.SYSTEM_ADMIN_EMAIL) {
        await this.create({
            name: process.env.SYSTEM_ADMIN_NAME || "System Admin",
            email: process.env.SYSTEM_ADMIN_EMAIL,
            password: process.env.SYSTEM_ADMIN_PASSWORD, // Hashed automatically
            role: "system_admin"
        });

        console.log("System admin initialized");
    }
};

export default mongoose.model("Auth", authSchema);


