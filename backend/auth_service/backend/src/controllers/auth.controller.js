import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/token.util.js";

// Controller for user signup
export const signUp = async (req, res) => {
    const {name, email, password, role, ...otherFields} = req.body;
    const isAdminRequest = req.path.includes('/admin/signup'); // Check if the request is for admin signup

    try {
        // Check if all required fields are provided
        if (!name || !email || !password) {
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

        // Check if customer with the same email already exists
        const existingUser = await Auth.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "Customer already exists"});
        }

        // Role handling
        let finalRole = role;

        if (isAdminRequest) {
            // Admin-created users
            if (req.user?.role !== "system_admin") {
                return res.status(403).json({message: "Admin access required"});
            }
            if (!["restaurant_admin", "delivery_personnel", "system_admin"].includes(role)) {
                return res.status(400).json({message: "Invalid role for admin signup"});
            }
        } else {
            // Public signup - only customers
            finalRole = "customer";
        }

        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new customer instance with the Auth model
        const newUser = new Auth({
            name,
            email,
            password: hashedPassword,
            role: finalRole,
            isProfileComplete: false // All roles complete profile later
        });

        await newUser.save();
        generateToken(newUser._id, res);

        // Response
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isProfileComplete: newUser.isProfileComplete,
            requiredFields: getRequiredFields(newUser.role)
        });

    } catch (error) {
        console.log("Error in signup controller:", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
};

// Helper: Returns required fields per role
const getRequiredFields = (role) => {
    const fieldMap = {
        customer: ["contact", "address"],
        restaurant_admin: ["restaurantId", "contact"],
        delivery_personnel: ["vehicleNumber", "contact"],
        system_admin: ["contact"]
    };
    return fieldMap[role] || [];
};

// Controller for user login
export const login = async (req, res) => {
    // Destructure the email and password from the request body
    const {email, password} = req.body;

    try {
        // Check if email log in users
        const user = await Auth.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid credentials"}); // send error response
        }

        // Check if the password is correct
        const checkPassword = await bcrypt.compare(password, user.password); // Compare the password

        if (!checkPassword) {
            return res.status(400).json({message: "Password Incorrect"}); // send error response
        }

        generateToken(user._id, res); // Generate JWT token

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in Login controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}

// Controller for user logout
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}

// Controller for user Profile
export const completeProfile = async (req, res) => {
    const userId = req.user._id;
    const updateData = req.body;

    try {
        const user = await Auth.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Validate role-specific fields
        const requiredFields = getRequiredFields(user.role);
        const missingFields = requiredFields.filter(field => !updateData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missingFields
            });
        }

        // Update User
        const updatedUser = await Auth.findByIdAndUpdate(
            userId,
            {
                ...updateData,
                isProfileComplete: true // Mark profile as complete
            },
            {new: true} // Return the updated user
        );

        res.status(200).json({
            _id: updatedUser._id,
            isProfileComplete: true,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.log("Error in completeProfile controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}

// Controller for getting user profile
export const getProfile = async (req, res) => {
    try {
        // Find the user by ID and exclude the password
        const user = await Auth.findById(req.user._id).select("-password");

        // Check if the user was found
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Construct the response based on the user's role
        const profileData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isProfileComplete: user.isProfileComplete,
            ...(user.role === "customer" && {contact: user.contact, address: user.address}),
            ...(user.role === "restaurant_admin" && {restaurantId: user.restaurantId, contact: user.contact}),
            ...(user.role === "delivery_personnel" && {vehicleNumber: user.vehicleNumber, contact: user.contact}),
        };

        // Send the profile data as a response
        res.status(200).json(profileData);
    } catch (error) {
        console.log("Error in getProfile controller", error.message); // log errors
        res.status(500).json({message: "Internal server error"}); // send error response
    }
}