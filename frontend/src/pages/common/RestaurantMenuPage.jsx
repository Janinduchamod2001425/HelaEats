import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import { useCartStore } from "../../store/useCartStore";
import toast from "react-hot-toast"; // Add this import

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams();
  const { menuItems, loading, error, fetchMenuItems } = useRestaurantStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems(restaurantId);
    }
  }, [restaurantId, fetchMenuItems]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading menu...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  // add to cart functionality

  const handleAddToCart = async (item) => {
    try {
      // Validate required fields
      if (!item._id || !item.restaurant) {
        toast.error("Invalid item data");
        return;
      }

      await addItem({
        itemId: item._id,
        restaurantId: restaurantId,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
      });

      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      {menuItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No menu items available for this restaurant.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Image Section */}
              <div className="h-48 bg-gray-100 relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/default-food.jpg";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-yellow-600">
                    LKR{item.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Black Add to Cart Button */}
                <button
                  className={`w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
                    !item.isAvailable ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenuPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { useRestaurantStore } from "../../store/useRestaurantStore";
// import {
//   FiEdit,
//   FiPlus,
//   FiTrash2,
//   FiToggleLeft,
//   FiToggleRight,
// } from "react-icons/fi";
// import RestaurantForm from "../../components/restaurant/RestaurantForm";
// import MenuItemForm from "../../components/restaurant/MenuItemForm";
// import toast from "react-hot-toast";

// const RestaurantMenuPage = () => {
//   const navigate = useNavigate();
//   const { authUser } = useAuthStore();
//   const {
//     restaurant,
//     menuItems,
//     loading,
//     fetchRestaurantByAdmin,
//     fetchMenuItems,
//     toggleMenuItemAvailability,
//     deleteMenuItem,
//   } = useRestaurantStore();

//   const [showRestaurantForm, setShowRestaurantForm] = useState(false);
//   const [showMenuItemForm, setShowMenuItemForm] = useState(false);
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [togglingItemId, setTogglingItemId] = useState(null);
//   const [filters, setFilters] = useState({
//     isAvailable: "",
//     category: "",
//   });

//   // ... keep existing useEffect hooks ...

//   const handleToggleAvailability = async (menuItemId) => {
//     setTogglingItemId(menuItemId);
//     try {
//       await toggleMenuItemAvailability(menuItemId);
//     } catch (error) {
//       console.error("Toggle error:", error);
//       toast.error("Failed to toggle availability");
//     } finally {
//       setTogglingItemId(null);
//     }
//   };

//   const handleDeleteMenuItem = async (menuItemId) => {
//     if (window.confirm("Are you sure you want to delete this menu item?")) {
//       try {
//         await deleteMenuItem(menuItemId);
//         toast.success("Menu item deleted successfully");
//       } catch (error) {
//         toast.error(error.message || "Failed to delete menu item");
//       }
//     }
//   };

//   const filteredMenuItems = menuItems
//     .filter((item) => {
//       if (filters.isAvailable === "") return true;
//       return item.isAvailable === (filters.isAvailable === "true");
//     })
//     .filter((item) => {
//       if (filters.category === "") return true;
//       return item.category === filters.category;
//     });

//   // ... keep existing loading and null checks ...

//   return (
//     <div className="p-4 md:p-6">
//       {/* Keep existing Restaurant Form Modal */}
//       {showRestaurantForm && (
//         <RestaurantForm
//           restaurant={restaurant}
//           onClose={() => setShowRestaurantForm(false)}
//           onSuccess={() => {
//             fetchRestaurantByAdmin(authUser._id);
//             setShowRestaurantForm(false);
//           }}
//         />
//       )}

//       {/* Menu Item Form Modal */}
//       {showMenuItemForm && (
//         <MenuItemForm
//           restaurantId={restaurant._id}
//           onClose={() => setShowMenuItemForm(false)}
//           onSuccess={() => {
//             fetchMenuItems(restaurant._id);
//             setShowMenuItemForm(false);
//           }}
//         />
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Keep existing Dashboard Overview section */}

//         {/* Add Menu Items Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mt-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold">Menu Items</h2>
//             <button
//               onClick={() => setShowMenuItemForm(true)}
//               className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
//             >
//               <FiPlus /> Add Menu Item
//             </button>
//           </div>

//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Availability
//               </label>
//               <select
//                 value={filters.isAvailable}
//                 onChange={(e) =>
//                   setFilters({ ...filters, isAvailable: e.target.value })
//                 }
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">All</option>
//                 <option value="true">Available</option>
//                 <option value="false">Unavailable</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 value={filters.category}
//                 onChange={(e) =>
//                   setFilters({ ...filters, category: e.target.value })
//                 }
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">All</option>
//                 <option value="Appetizer">Appetizer</option>
//                 <option value="Main Course">Main Course</option>
//                 <option value="Dessert">Dessert</option>
//                 <option value="Beverage">Beverage</option>
//                 <option value="Side Dish">Side Dish</option>
//               </select>
//             </div>
//           </div>

//           {/* Menu Items Grid */}
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
//             </div>
//           ) : filteredMenuItems.length === 0 ? (
//             <p className="text-center text-gray-500 py-8">
//               No menu items found matching your filters.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredMenuItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
//                 >
//                   {item.imageUrl && (
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="w-full h-48 object-cover"
//                     />
//                   )}
//                   <div className="p-4">
//                     <div className="flex justify-between items-start">
//                       <h3 className="text-lg font-semibold">{item.name}</h3>
//                       <span className="text-yellow-600 font-bold">
//                         LKR {item.price?.toFixed(2) || "0.00"}
//                       </span>
//                     </div>

//                     <div className="flex items-center mt-1 mb-2">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           item.isAvailable
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {item.isAvailable ? "Available" : "Unavailable"}
//                       </span>
//                       <span className="mx-2 text-gray-300">•</span>
//                       <span className="text-sm text-gray-500">
//                         {item.category}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center mt-4">
//                       <button
//                         onClick={() => handleToggleAvailability(item._id)}
//                         disabled={loading && togglingItemId === item._id}
//                         className="flex items-center gap-1 text-sm disabled:opacity-50"
//                       >
//                         {item.isAvailable ? (
//                           <>
//                             <FiToggleRight
//                               className="text-green-500"
//                               size={20}
//                             />
//                             <span>Toggle</span>
//                           </>
//                         ) : (
//                           <>
//                             <FiToggleLeft className="text-gray-400" size={20} />
//                             <span>Toggle</span>
//                           </>
//                         )}
//                       </button>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             navigate(
//                               `/restaurantadmin/menu-items/${item._id}/edit`
//                             )
//                           }
//                           className="text-blue-500 hover:text-blue-700"
//                         >
//                           <FiEdit size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteMenuItem(item._id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FiTrash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestaurantMenuPage;
