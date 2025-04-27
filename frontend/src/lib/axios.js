import axios from "axios";

// export const axiosAuthInstance = axios.create({
//   baseURL:
//     import.meta.env.MODE === "development"
//       ? "http://localhost:5001/api"
//       : "/api",
//   withCredentials: true,
// });

// sachintha changes
export const axiosAuthInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const axiosOrderInstance = axios.create({
  baseURL: "http://localhost:5003",
  withCredentials: true, // Important for sending cookies
});

export const axiosPaymentInstance = axios.create({
  baseURL: "http://localhost:5004",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
