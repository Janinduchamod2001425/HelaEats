import axios from "axios";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const response = await axios.get("http://localhost:5001/api/auth/check", {
      headers: {
        Cookie: `jwt=${token}`,
      },
      withCredentials: true,
    });

    req.user = response.data;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
