import React, { useState } from "react";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const MenuItemForm = ({ restaurantId, menuItem, onClose }) => {
  const { createMenuItem, updateMenuItem } = useRestaurantStore();
  const [formData, setFormData] = useState({
    name: menuItem?.name || "",
    description: menuItem?.description || "",
    price: menuItem?.price?.toString() || "0",
    category: menuItem?.category || "Main Course",
    isAvailable: menuItem?.isAvailable !== false,
    preparationTime: menuItem?.preparationTime?.toString() || "15",
    isVegetarian: menuItem?.isVegetarian || false,
    isVegan: menuItem?.isVegan || false,
    isGlutenFree: menuItem?.isGlutenFree || false,
    imageUrl: menuItem?.imageUrl || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.name.trim() || !formData.price) {
        throw new Error("Name and price are required");
      }

      const menuItemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        isAvailable: formData.isAvailable,
        preparationTime: parseInt(formData.preparationTime) || 15,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        imageUrl: formData.imageUrl.trim(),
        restaurant: restaurantId,
      };

      if (menuItem) {
        await updateMenuItem(menuItem._id, menuItemData);
        toast.success("Menu item updated successfully!");
      } else {
        await createMenuItem(menuItemData);
        toast.success("Menu item created successfully!");
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error(error.message || "Failed to save menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">
          {menuItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (LKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preparation Time (minutes) *
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Side Dish">Side Dish</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                id="isAvailable"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                Available
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleChange}
                id="isVegetarian"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-700">
                Vegetarian
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleChange}
                id="isVegan"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isVegan" className="ml-2 block text-sm text-gray-700">
                Vegan
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleChange}
                id="isGlutenFree"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isGlutenFree" className="ml-2 block text-sm text-gray-700">
                Gluten Free
              </label>
            </div>
          </div>
          
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
                  {menuItem ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span>{menuItem ? "Update" : "Create"} Menu Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MenuItemForm.defaultProps = {
  onClose: () => {},
  menuItem: null,
};

export default MenuItemForm;