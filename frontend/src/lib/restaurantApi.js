// src/lib/restaurantApi.js
import axios from "axios";

export const restaurantApi = axios.create({
  baseURL: "http://localhost:5005/api",
  withCredentials: true, // This is what triggers the credentialed request
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to handle errors
restaurantApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);