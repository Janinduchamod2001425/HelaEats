import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/token.util.js";

// Function to sign up customers
export const signUpCustomers = async (req, res) => {
    // Destructure the user details from the request body
    const {name, email, password, contact, address} = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password || !contact || !address) {
            return res.status(400).json({message: "All fields required"});
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Please enter a valid email address"});
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // Validate the contact
        if (contact.length !== 10) {
            return res.status(400).json({message: "Contact must be 10 digits"});
        }

        // Check if customer with the same email already exists
        const existingCustomer = await Auth.findOne({email});

        if (existingCustomer) {
            return res.status(400).json({message: "Customer already exists"});
        }

        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new customer instance with the Auth model
        const newCustomer = new Auth({
            name,
            email,
            password: hashedPassword,
            contact,
            address,
            role: "customer", // Set default role as customer
        });

        // Save the new customer to the database
        if (newCustomer) {
            generateToken(newCustomer._id, res); // Generate JWT token
            await newCustomer.save(); // Save the customer in the database

            // Send response with the newly created customer details
            res.status(200).json({
                _id: newCustomer._id,
                name: newCustomer.name,
                email: newCustomer.email,
                contact: newCustomer.contact,
                address: newCustomer.address,
                role: newCustomer.role,
            });
        } else {
            res.status(500).json({message: "Invalid customer data"});
        }

    } catch (error) {
        console.log("Error in signup customer controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Function to sign up other roles (System_Admin, Restaurant_Admin, Delivery_Personnel)
export const signUpOtherRoles = async (req, res) => {
    // Destructure the user details from the request body
    const {name, email, password, contact, role, restaurantId, vehicleNumber} = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password || !contact) {
            return res.status(400).json({message: "Missing required fields"});
        }

        // Validate user roles
        const validRoles = ["system_admin", "restaurant_admin", "delivery_personnel"];
        if (!validRoles.includes(role)) {
            return res.status(400).json(
                {
                    message: "Invalid role",
                    allowedRoles: validRoles
                }
            );
        }

        // Check if the role is restaurant_admin by validating the restaurantId
        if (role === "restaurant_admin" && !restaurantId) {
            return res.status(400).json({message: "Restaurant ID required for restaurant admin role"});
        }

        // Check if the role is delivery_personnel by validating the vehicleNumber
        if (role === "delivery_personnel" && !vehicleNumber) {
            return res.status(400).json({message: "Vehicle Number required for delivery personnel role"});
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // Check if user with the same email already exists
        const existingUser = await Auth.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "Email already exists, please use a different email"});
        }

        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance with the Auth model
        const newUser = new Auth({
            name,
            email,
            password: hashedPassword,
            contact,
            role,
            ...(role === "restaurant_admin" && {restaurantId}),
            ...(role === "delivery_personnel" && {vehicleNumber}),
        });

        // Save the new user to the database
        if (newUser) {
            generateToken(newUser._id, res); // Generate JWT token
            await newUser.save(); // Save the user in the database

            // Send response with the newly created user details
            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                contact: newUser.contact,
                role: newUser.role,
                ...(newUser.restaurantId && {restaurantId: newUser.restaurantId}),
                ...(newUser.vehicleNumber && {vehicleNumber: newUser.vehicleNumber}),
            });
        } else {
            res.status(500).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup other roles controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};