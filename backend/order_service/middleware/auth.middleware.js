import axios from "axios";

export const verifyToken = async (req, res, next) => {
  try {
    // Get token from request cookies
    const token = req.cookies.jwt;
    console.log("Received token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify token with auth service
    const response = await axios.get("http://localhost:5001/api/auth/check", {
      headers: {
        Cookie: `jwt=${token}`,
      },
      withCredentials: true,
    });

    // Set user data in request
    req.user = response.data;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
