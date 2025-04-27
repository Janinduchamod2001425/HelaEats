 // src/store/useRestaurantStore.js
 import { create } from "zustand";
 import { restaurantApi } from "../lib/restaurantApi";
 import toast from 'react-hot-toast'; 
 
 export const useRestaurantStore = create((set) => ({
   restaurant: null,
   menuItems: [],
   loading: false,
   error: null,
 
   // Fetch restaurant by admin ID
   fetchRestaurant: async (adminId) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.get(`/restaurants?adminId=${adminId}`);
       set({ restaurant: response.data[0], loading: false });
     } catch (error) {
       set({ error: error.message, loading: false });
     }
   },
 
   // Create new restaurant
   createRestaurant: async (restaurantData) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.post('/restaurants', restaurantData);
       if (response.data.success) {
         set({ restaurant: response.data.data, loading: false });
         toast.success('Restaurant created successfully!');
         return response.data.data;
       } else {
         throw new Error(response.data.error || 'Failed to create restaurant');
       }
     } catch (error) {
       console.error('API Error:', error);
       const message = error.response?.data?.error || 
                      error.message || 
                      'Network error - please check your connection';
       set({ error: message, loading: false });
       toast.error(message);
       throw error;
     }
   },
  // Update restaurant
 updateRestaurant: async (id, updateData) => {
   set({ loading: true, error: null });
   try {
     const response = await restaurantApi.put(`/restaurants/${id}`, updateData);
     if (response.data.success) {
       set({ restaurant: response.data.data, loading: false });
       toast.success('Restaurant updated successfully!');
       return response.data.data;
     } else {
       throw new Error(response.data.error || 'Failed to update restaurant');
     }
   } catch (error) {
     const message = error.response?.data?.error || 
                    error.message || 
                    'Failed to update restaurant';
     set({ error: message, loading: false });
     toast.error(message);
     throw error;
   }
 },
 
   fetchRestaurantByAdmin: async (adminId) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.get(`/restaurants/admin/${adminId}`);
       if (response.data.success) {
         set({ restaurant: response.data.data, loading: false });
       } else {
         set({ restaurant: null, loading: false });
       }
     } catch (error) {
       set({ 
         error: error.message, 
         loading: false,
         restaurant: null
       });
     }
   },
 
   // Fetch menu items for restaurant
   fetchMenuItems: async (restaurantId) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.get(`/menu-items/restaurant/${restaurantId}`);
       set({ menuItems: response.data, loading: false });
     } catch (error) {
       set({ error: error.message, loading: false });
     }
   },
 
   // Create menu item
   createMenuItem: async (menuItemData) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.post('/menu-items', menuItemData);
       set(state => ({
         menuItems: [...state.menuItems, response.data],
         loading: false
       }));
       return response.data;
     } catch (error) {
       set({ error: error.message, loading: false });
       throw error;
     }
   },
 
 
   updateMenuItem: async (id, updateData) => {
     set({ loading: true, error: null });
     try {
       const response = await restaurantApi.put(`/menu-items/${id}`, updateData);
       
       if (response.data?.success) {
         set((state) => ({
           menuItems: state.menuItems.map((item) =>
             item._id === id ? response.data.data : item
           ),
           loading: false,
         }));
         toast.success(response.data.message || 'Menu item updated');
         return response.data.data;
       } else {
         throw new Error(response.data?.message || 'Failed to update menu item');
       }
     } catch (error) {
       const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to update menu item';
       set({ error: errorMsg, loading: false });
       toast.error(errorMsg);
       throw error;
     }
   },
 
 // Toggle menu item availability
 toggleMenuItemAvailability: async (id) => {
   set({ loading: true, error: null });
   try {
     const response = await restaurantApi.patch(`/menu-items/${id}/toggle-availability`);
     
     if (response.data?.success) {
       set(state => ({
         menuItems: state.menuItems.map(item => 
           item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
         ),
         loading: false
       }));
       toast.success(response.data.message || 'Availability updated');
       return response.data.data;
     } else {
       throw new Error(response.data?.message || 'Failed to update availability');
     }
   } catch (error) {
     const errorMsg = error.response?.data?.message || 
                    error.message || 
                    'Failed to toggle availability';
     set({ error: errorMsg, loading: false });
     toast.error(errorMsg);
     throw error;
   }
 },
  // Delete menu item
 deleteMenuItem: async (id) => {
   set({ loading: true, error: null });
   try {
     const response = await restaurantApi.delete(`/menu-items/${id}`);
     
     if (response.data?.success) {
       set((state) => ({
         menuItems: state.menuItems.filter((item) => item._id !== id),
         loading: false,
       }));
       toast.success(response.data.message || 'Menu item deleted');
       return response.data.data;
     } else {
       throw new Error(response.data?.message || 'Failed to delete menu item');
     }
   } catch (error) {
     const errorMsg = error.response?.data?.message || 
                    error.message || 
                    'Failed to delete menu item';
     set({ error: errorMsg, loading: false });
     toast.error(errorMsg);
     throw error;
   }
 },
 
 
 
 })); 