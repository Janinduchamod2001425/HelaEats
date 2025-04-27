import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const RestaurantForm = ({ restaurant, onClose, onSuccess }) => {
  const { authUser } = useAuthStore();
  const { createRestaurant, updateRestaurant } = useRestaurantStore();
  
  // Default opening hours
  const defaultOpeningHours = {
    monday: { open: "09:30", close: "21:30" },
    tuesday: { open: "09:30", close: "21:30" },
    wednesday: { open: "09:30", close: "21:30" },
    thursday: { open: "09:30", close: "21:30" },
    friday: { open: "09:30", close: "21:30" },
    saturday: { open: "09:30", close: "21:30" },
    sunday: { open: "09:30", close: "21:30" },
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      address: "",
      city: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    contact: {
      phone: "",
      email: "",
    },
    openingHours: defaultOpeningHours,
    isActive: true,
    cuisineType: "",
    rating: 0,
    imageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with restaurant data if editing
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        description: restaurant.description || "",
        location: restaurant.location || {
          address: "",
          city: "",
          coordinates: { lat: 0, lng: 0 },
        },
        contact: restaurant.contact || { phone: "", email: "" },
        openingHours: restaurant.openingHours || defaultOpeningHours,
        isActive: restaurant.isActive !== false,
        cuisineType: restaurant.cuisineType || "",
        rating: restaurant.rating || 0,
        imageUrl: restaurant.imageUrl || "",
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child, subChild] = name.split(".");
      
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.location.address || !formData.location.city || !formData.contact.phone) {
        throw new Error("Please fill in all required fields");
      }

      const restaurantData = {
        ...formData,
        adminId: authUser._id,
      };
      
      if (restaurant) {
        // Update existing restaurant
        await updateRestaurant(restaurant._id, restaurantData);
        toast.success("Restaurant updated successfully!");
      } else {
        // Create new restaurant
        await createRestaurant(restaurantData);
        toast.success("Restaurant created successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error(error.message || "Failed to save restaurant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          }));
          toast.success("Location set successfully!");
        },
        (error) => {
          toast.error("Could not get location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const renderTimeInput = (day, type) => (
    <input
      type="time"
      name={`openingHours.${day}.${type}`}
      value={formData.openingHours[day][type]}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-screen relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">
          {restaurant ? "Edit Restaurant" : "Register Your Restaurant"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/restaurant-image.jpg"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Coordinates
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.location.coordinates.lat}
                readOnly
                placeholder="Latitude"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                value={formData.location.coordinates.lng}
                readOnly
                placeholder="Longitude"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="whitespace-nowrap px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Get Location
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Cuisine Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Type *
            </label>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select cuisine type</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="Sri Lankan">Sri Lankan</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Rating (0-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              id="isActive"
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Restaurant is Active
            </label>
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Hours
            </label>
            <div className="space-y-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day} className="grid grid-cols-3 gap-2 items-center">
                  <span className="capitalize">{day}</span>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Open</label>
                    {renderTimeInput(day, 'open')}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Close</label>
                    {renderTimeInput(day, 'close')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {restaurant ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span>{restaurant ? "Update" : "Register"} Restaurant</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RestaurantForm.defaultProps = {
  onClose: () => {},
  onSuccess: () => {},
  restaurant: null,
};

export default RestaurantForm;