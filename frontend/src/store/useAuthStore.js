import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosAuthInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// export const useAuthStore = create(
//   persist((set, get) => ({
//     authUser: null,
//     isSigningUp: false,
//     isLoggingIn: false,
//     isUpdatingProfile: false,
//     isCheckingAuth: true,

//     checkAuth: async () => {
//       try {
//         const res = await axiosAuthInstance.get("/auth/check");
//         set({ authUser: res.data });
//       } catch (error) {
//         console.log("Error in CheckAuth", error);
//         set({ authUser: null });
//       } finally {
//         set({ isCheckingAuth: false });
//       }
//     },

//     signupCustomer: async (data) => {
//       set({ isSigningUp: true });
//       try {
//         const res = await axiosAuthInstance.post("/auth/signup", {
//           ...data,
//           role: "customer",
//         });
//         set({ authUser: res.data });
//         toast.success("Account created successfully");
//         return res.data;
//       } catch (error) {
//         toast.error(error.response.data.message);
//         throw error;
//       } finally {
//         set({ isSigningUp: false });
//       }
//     },

//     signupAdmin: async (data) => {
//       set({ isSigningUp: true });
//       try {
//         const res = await axiosAuthInstance.post("/auth/admin/signup", {
//           ...data,
//         });
//         set({ authUser: res.data });
//         toast.success("Account created successfully");
//         return res.data;
//       } catch (error) {
//         toast.error(error.response.data.message);
//         throw error;
//       } finally {
//         set({ isSigningUp: false });
//       }
//     },

//     login: async (data) => {
//       set({ isLoggingIn: true });
//       try {
//         const res = await axiosAuthInstance.post("/auth/login", data);
//         set({ authUser: res.data });
//         toast.success("Logged in successfully");
//         return res.data;
//       } catch (error) {
//         toast.error(error.response.data.message);
//       } finally {
//         set({ isLoggingIn: false });
//       }
//     },

//     logout: async () => {
//       try {
//         await axiosAuthInstance.post("/auth/logout");
//         set({ authUser: null });
//         toast.success("Logged out successfully");
//       } catch (error) {
//         toast.error(error.response.data.message);
//       }
//     },

//     completeProfile: async (data) => {
//       set({ isUpdatingProfile: true });
//       try {
//         const res = await axiosAuthInstance.patch(
//           "/auth/complete-profile",
//           data
//         );
//         set({ authUser: res.data });
//         toast.success("Profile updated successfully");
//       } catch (error) {
//         toast.error(error.response.data.message);
//       } finally {
//         set({ isUpdatingProfile: false });
//       }
//     },

//     getProfile: async () => {
//       try {
//         const res = await axiosAuthInstance.get("/auth/profile");
//         set({ authUser: res.data });
//       } catch (error) {
//         toast.error(error.response.data.message);
//       }
//     },
//   }))
// );

// uda tika janiduge
// changes sachintha made

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
        set({ authUser: res.data, isCheckingAuth: false });
      } catch (error) {
        console.error("Error in CheckAuth:", error);
        set({ authUser: null, isCheckingAuth: false });
      }
    },

    // signupCustomer: async (data) => {
    //   set({ isSigningUp: true });
    //   try {
    //     const res = await axiosAuthInstance.post("/auth/signup", {
    //       ...data,
    //       role: "customer",
    //     });
    //     set({ authUser: res.data.user });
    //     toast.success("Account created successfully");
    //     return res.data;
    //   } catch (error) {
    //     toast.error(error.response?.data?.message || "Signup failed");
    //     throw error;
    //   } finally {
    //     set({ isSigningUp: false });
    //   }
    // },
    signupCustomer: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosAuthInstance.post("/auth/signup", {
          ...data,
          role: "customer",
        });

        // Make sure we're setting the user data from the response correctly
        if (res.data && res.data.user) {
          set({ authUser: res.data.user });
          toast.success("Account created successfully");
          return res.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error(error.response?.data?.message || "Signup failed");
        throw error;
      } finally {
        set({ isSigningUp: false });
      }
    },

    signupAdmin: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosAuthInstance.post("/auth/admin/signup", data);
        set({ authUser: res.data.user });
        toast.success("Account created successfully");
        return res.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Admin signup failed");
        throw error;
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosAuthInstance.post("/auth/login", data);
        set({ authUser: res.data.user });
        toast.success("Logged in successfully");
        return res.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
        throw error;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
      try {
        await axiosAuthInstance.post("/auth/logout");
        set({ authUser: null });
        localStorage.removeItem("auth-store"); // Clear only auth store
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error(error.response?.data?.message || "Logout failed");
      }
    },

    completeProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosAuthInstance.patch(
          "/auth/complete-profile",
          data
        );
        set({ authUser: res.data.user });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Profile update failed");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    getProfile: async () => {
      try {
        const res = await axiosAuthInstance.get("/auth/profile");
        set({ authUser: res.data });
      } catch (error) {
        console.error("Get profile error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      }
    },

    resetAuthState: () => {
      set({
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: false,
      });
    },
  })),
  {
    name: "auth-store",
    getStorage: () => localStorage,
    partialize: (state) => ({
      authUser: state.authUser,
    }),
  }
);
