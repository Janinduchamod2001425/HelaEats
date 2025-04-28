import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import { FiArrowLeft } from "react-icons/fi";
import MenuItemForm from "../../components/restaurant/MenuItemForm";
import toast from "react-hot-toast";

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menuItems, restaurant, loading, fetchMenuItems } =
    useRestaurantStore();

  // Find the menu item to edit
  const menuItem = menuItems.find((item) => item._id === id);

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
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <FiArrowLeft /> Back to Menu
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Menu Item Not Found</h2>
            <p className="text-gray-600">
              The menu item you're trying to edit doesn't exist.
            </p>
          </div>
        </div>
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Menu Item</h2>
          <MenuItemForm
            restaurantId={restaurant._id}
            menuItem={menuItem}
            onClose={() => navigate(-1)}
            onSuccess={() => {
              fetchMenuItems(restaurant._id);
              navigate(-1);
              toast.success("Menu item updated successfully");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMenuItem;
