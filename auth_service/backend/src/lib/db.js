import mongoose from "mongoose";

// Function for connected MongoDB Database
export const connectDB = async () => {
    try {
        // Connect the mongodb database through mongoose
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error", error);
    }
};