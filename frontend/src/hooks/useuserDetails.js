import { useState, useEffect } from "react";
import { axiosAuthInstance } from "../lib/axios";

export const useUserDetails = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axiosAuthInstance.get(`/auth/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(
          error.response?.data?.message || "Failed to fetch user details"
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return { user, loading, error };
};
