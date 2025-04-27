import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import MenuItemForm from "../../components/restaurant/MenuItemForm";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const MenuItemEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    menuItems, 
    fetchMenuItems, 
    restaurant,
    loading
  } = useRestaurantStore();

  // Find the menu item to edit
  const menuItem = menuItems.find(item => item._id === id);

  useEffect(() => {
    if (restaurant?._id && !menuItem) {
      fetchMenuItems(restaurant._id);
    }
  }, [restaurant, fetchMenuItems, menuItem]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!menuItem) {
    toast.error("Menu item not found");
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Menu Item Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FiArrowLeft /> Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <FiArrowLeft /> Back to Menu
        </button>
        
        <MenuItemForm 
          restaurantId={restaurant._id} 
          menuItem={menuItem}
          onClose={() => navigate(-1)}
          onSuccess={() => {
            fetchMenuItems(restaurant._id);
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};

export default MenuItemEditPage;