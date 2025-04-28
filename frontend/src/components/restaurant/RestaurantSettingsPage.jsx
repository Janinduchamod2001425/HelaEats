import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import { FiEdit } from "react-icons/fi";
import RestaurantForm from "../../components/restaurant/RestaurantForm";

const RestaurantSettingsPage = () => {
  const { authUser } = useAuthStore();
  const { restaurant, fetchRestaurantByAdmin } = useRestaurantStore();
  const [showRestaurantForm, setShowRestaurantForm] = React.useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Restaurant Settings</h1>
          <button
            onClick={() => setShowRestaurantForm(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <FiEdit /> Edit Restaurant
          </button>
        </div>

        {showRestaurantForm && (
          <RestaurantForm
            restaurant={restaurant}
            onClose={() => setShowRestaurantForm(false)}
            onSuccess={() => {
              fetchRestaurantByAdmin(authUser._id);
              setShowRestaurantForm(false);
            }}
          />
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium">{restaurant?.name}</span>
                </p>
                <p>
                  <span className="text-gray-500">Cuisine Type:</span>{" "}
                  <span className="font-medium">{restaurant?.cuisineType}</span>
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`font-medium ${
                      restaurant?.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {restaurant?.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="font-medium">
                    {restaurant?.contact?.phone}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">
                    {restaurant?.contact?.email}
                  </span>
                </p>
              </div>
            </div>

            {/* Location Information */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-4">Location</h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  <span className="font-medium">
                    {restaurant?.location?.address}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">City:</span>{" "}
                  <span className="font-medium">
                    {restaurant?.location?.city}
                  </span>
                </p>
                {restaurant?.location?.coordinates && (
                  <p>
                    <span className="text-gray-500">Coordinates:</span>{" "}
                    <span className="font-medium">
                      {restaurant.location.coordinates.lat},{" "}
                      {restaurant.location.coordinates.lng}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-4">
                Operating Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant?.openingHours &&
                  Object.entries(restaurant.openingHours).map(
                    ([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{day}:</span>
                        <span className="font-medium">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettingsPage;
