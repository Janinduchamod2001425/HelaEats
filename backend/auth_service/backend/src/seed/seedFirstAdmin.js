import {connectDB} from "../lib/db.js";
import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";

const seedFirstAdmin = async () => {
    try {
        // Use your existing connection function
        await connectDB();

        // Check if any admin exists
        const existingAdmin = await Auth.findOne({role: "system_admin"});
        if (existingAdmin) {
            console.log("Admin already exists:", existingAdmin.email);
            return {success: true, exists: true};
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Admin@1234", salt);

        // Create first admin
        const admin = new Auth({
            name: "System Admin",
            email: "admin@first.com",
            password: hashedPassword,
            role: "system_admin",
            isProfileComplete: true,
        });

        await admin.save();
        console.log("First admin created:", admin.email);
        return {success: true, created: true};

    } catch (error) {
        console.error("Error seeding admin:", error.message);
        return {success: false, error: error.message};
    } finally {
        // Close the connection if needed
        // mongoose.connection.close(); // Uncomment if you want to close after seeding
    }
};

// Execute only when run directly (not when imported)
if (process.argv[1].includes('seedFirstAdmin.js')) {
    seedFirstAdmin()
        .then(result => {
            if (!result.success) process.exit(1);
            process.exit(0);
        })
        .catch(err => {
            console.error("Unhandled error:", err);
            process.exit(1);
        });
}

export default seedFirstAdmin;