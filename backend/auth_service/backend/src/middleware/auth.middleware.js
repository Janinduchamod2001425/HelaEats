import jwt from 'jsonwebtoken';
import Auth from "../models/auth.model.js";

// Common Middleware to protect the routes
export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the jwt cookie
        const token = req.cookies.jwt;

        // Check if the token is valid
        if (!token) {
            return res.status(401).json({error: 'Unauthorized - No token provided'});
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is valid
        if (!decoded) {
            return res.status(401).json({error: 'Unauthorized - Invalid token'});
        }

        // Check if the user exists
        const user = await Auth.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({error: 'User not found'});
        }

        // Set the user in the request object
        req.user = user;

        // Call the next middleware
        next();

    } catch (error) {
        console.log("Error in Protect Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}

// Middleware to protect customer routes separately
export const protectCustomerRoutes = async (req, res, next) => {
    try {
        // Check if the user and has a customer role
        if (!req.user || req.user.role !== "customer") {
            return res.status(403).json({error: 'Unauthorized - Only customers can access this route'});
        }

        // proceed to next middleware
        next();
    } catch (error) {
        console.log("Error in Protect Customer Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Middleware to protect restaurant_admin routes separately
export const protectRestaurantAdminRoutes = async (req, res, next) => {
    try {
        // Check if the user and has a restaurant_admin role
        if (!req.user || req.user.role !== "restaurant_admin") {
            return res.status(403).json({error: 'Unauthorized - Only restaurant admins can access this route'});
        }

        // proceed to next middleware
        next();
    } catch (error) {
        console.log("Error in Protect Customer Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Middleware to protect delivery_personnel routes separately
export const protectDeliveryPersonnelRoutes = async (req, res, next) => {
    try {
        // Check if the user and has a restaurant_admin role
        if (!req.user || req.user.role !== "delivery_personnel") {
            return res.status(403).json({error: 'Unauthorized - Only delivery personnel can access this route'});
        }

        // proceed to next middleware
        next();
    } catch (error) {
        console.log("Error in Protect Customer Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Middleware to protect system admin routes separately
export const protectSystemAdminRoutes = async (req, res, next) => {
    try {
        // Check if the user and has a restaurant_admin role
        if (!req.user || req.user.role !== "system_admin") {
            return res.status(403).json({error: 'Unauthorized - Only system admins can access this route'});
        }

        // proceed to next middleware
        next();
    } catch (error) {
        console.log("Error in Protect Customer Route middleware", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};