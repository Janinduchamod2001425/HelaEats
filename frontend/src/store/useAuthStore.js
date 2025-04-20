import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosAuthInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create(
  persist((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
      try {
        const res = await axiosAuthInstance.get("/auth/check");
        set({ authUser: res.data });
      } catch (error) {
        console.log("Error in CheckAuth", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data, isAdmin = false) => {
      set({ isSigningUp: true });
      try {
        const endpoint = isAdmin ? "/admin/signup" : "/auth/signup";
        const res = await axiosAuthInstance.post(endpoint, data);
        set({ authUser: res.data });
        toast.success("Account created successfully");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message);
        throw error;
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosAuthInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
      try {
        await axiosAuthInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    completeProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosAuthInstance.patch(
          "/auth/complete-profile",
          data,
        );
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    getProfile: async () => {
      try {
        const res = await axiosAuthInstance.get("/auth/profile");
        set({ authUser: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  })),
);
