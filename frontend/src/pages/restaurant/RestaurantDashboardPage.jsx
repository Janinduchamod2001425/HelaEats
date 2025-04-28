// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { useRestaurantStore } from "../../store/useRestaurantStore";
// import toast from "react-hot-toast";
// import {
//   FiPlus,
//   FiEdit,
//   FiTrash2,
//   FiToggleLeft,
//   FiToggleRight,
// } from "react-icons/fi";
// import RestaurantForm from "../../components/restaurant/RestaurantForm";
// import MenuItemForm from "../../components/restaurant/MenuItemForm";

// const RestaurantDashboardPage = () => {
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

//   const [filters, setFilters] = useState({
//     isAvailable: "",
//     category: "",
//   });
//   const [showMenuItemForm, setShowMenuItemForm] = useState(false);
//   const [showRestaurantForm, setShowRestaurantForm] = useState(false);
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [togglingItemId, setTogglingItemId] = useState(null);

//   useEffect(() => {
//     if (authUser?.role === "restaurant_admin" && authUser?._id) {
//       fetchRestaurantByAdmin(authUser._id).finally(() => {
//         setInitialLoadComplete(true);
//       });
//     }
//   }, [authUser, fetchRestaurantByAdmin]);

//   useEffect(() => {
//     if (restaurant?._id) {
//       fetchMenuItems(restaurant._id);
//     }
//   }, [restaurant, fetchMenuItems]);

//   const handleToggleAvailability = async (menuItemId) => {
//     setTogglingItemId(menuItemId);
//     try {
//       await toggleMenuItemAvailability(menuItemId);
//     } catch (error) {
//       console.error("Toggle error:", error);
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

//   if (loading && !initialLoadComplete) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
//       </div>
//     );
//   }

//   if (!restaurant && initialLoadComplete) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold mb-4">Register Your Restaurant</h2>
//           <p className="mb-6">
//             As a restaurant admin, you need to register your restaurant first.
//           </p>
//           <RestaurantForm
//             onClose={() => setShowRestaurantForm(false)}
//             onSuccess={() => {
//               fetchRestaurantByAdmin(authUser._id);
//               setShowRestaurantForm(false);
//             }}
//           />
//         </div>
//       </div>
//     );
//   }

//   if (!restaurant) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       {/* Restaurant Form Modal */}
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

//       <div className="max-w-6xl mx-auto">
//         {restaurant.imageUrl && (
//           <div className="mb-8 rounded-lg overflow-hidden shadow-md">
//             <img
//               src={restaurant.imageUrl}
//               alt={restaurant.name}
//               className="w-full h-64 md:h-80 object-cover"
//             />
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
//             <p className="text-gray-600 mb-4">{restaurant.description}</p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold text-gray-700">Location</h3>
//                 <p className="text-gray-600">
//                   {restaurant.location?.address}, {restaurant.location?.city}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-700">Contact</h3>
//                 <p className="text-gray-600">{restaurant.contact?.phone}</p>
//                 {restaurant.contact?.email && (
//                   <p className="text-gray-600">{restaurant.contact.email}</p>
//                 )}
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-700">Cuisine Type</h3>
//                 <p className="text-gray-600">{restaurant.cuisineType}</p>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-700">Status</h3>
//                 <p className="text-gray-600">
//                   {restaurant.isActive ? 'Active' : 'Inactive'}
//                 </p>
//               </div>

//               <div className="md:col-span-2">
//                 <button
//                   onClick={() => setShowRestaurantForm(true)}
//                   className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
//                 >
//                   <FiEdit /> Edit Restaurant
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Menu Items</h2>
//             <button
//               onClick={() => setShowMenuItemForm(true)}
//               className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
//             >
//               <FiPlus /> Add Menu Item
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Availability
//               </label>
//               <select
//                 value={filters.isAvailable}
//                 onChange={(e) => setFilters({...filters, isAvailable: e.target.value})}
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
//                 onChange={(e) => setFilters({...filters, category: e.target.value})}
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
//                         LKR {item.price?.toFixed(2) || '0.00'}
//                       </span>
//                     </div>

//                     <div className="flex items-center mt-1 mb-2">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {item.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                       <span className="mx-2 text-gray-300">•</span>
//                       <span className="text-sm text-gray-500">
//                         {item.category}
//                       </span>
//                       <span className="mx-2 text-gray-300">•</span>
//                       <span className="text-sm text-gray-500">
//                         {item.preparationTime || 15} min
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap gap-1 mb-3">
//                       {item.isVegetarian && (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           Vegetarian
//                         </span>
//                       )}
//                       {item.isVegan && (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           Vegan
//                         </span>
//                       )}
//                       {item.isGlutenFree && (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           Gluten Free
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={() => handleToggleAvailability(item._id)}
//                         disabled={loading && togglingItemId === item._id}
//                         className="flex items-center gap-1 text-sm disabled:opacity-50"
//                       >
//                         {item.isAvailable ? (
//                           <>
//                             <FiToggleRight className="text-green-500" />
//                             <span>Toggle</span>
//                           </>
//                         ) : (
//                           <>
//                             <FiToggleLeft className="text-gray-400" />
//                             <span>Toggle</span>
//                           </>
//                         )}
//                         {loading && togglingItemId === item._id && (
//                           <span className="ml-1">...</span>
//                         )}
//                       </button>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => navigate(`/menu-items/${item._id}/edit`)}
//                           className="text-blue-500 hover:text-blue-700"
//                         >
//                           <FiEdit />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteMenuItem(item._id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FiTrash2 />
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

// export default RestaurantDashboardPage;

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

// const RestaurantDashboardPage = () => {
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

// export default RestaurantDashboardPage;

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import { FiEdit } from "react-icons/fi";
import RestaurantForm from "../../components/restaurant/RestaurantForm";

const RestaurantDashboardPage = () => {
  const { authUser } = useAuthStore();
  const {
    restaurant,
    menuItems,
    loading,
    fetchRestaurantByAdmin,
    fetchMenuItems,
  } = useRestaurantStore();
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (authUser?.role === "restaurant_admin" && authUser?._id) {
      fetchRestaurantByAdmin(authUser._id).finally(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [authUser, fetchRestaurantByAdmin]);

  useEffect(() => {
    if (restaurant?._id) {
      fetchMenuItems(restaurant._id);
    }
  }, [restaurant, fetchMenuItems]);

  if (loading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!restaurant && initialLoadComplete) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Register Your Restaurant</h2>
          <p className="mb-6">
            As a restaurant admin, you need to register your restaurant first.
          </p>
          <RestaurantForm
            onClose={() => setShowRestaurantForm(false)}
            onSuccess={() => {
              fetchRestaurantByAdmin(authUser._id);
              setShowRestaurantForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
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

      <div className="max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Today's Orders</h3>
            <p className="text-2xl font-bold">0</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Active Menu Items</h3>
            <p className="text-2xl font-bold">
              {menuItems.filter((item) => item.isAvailable).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold">Rs. 0.00</p>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">Restaurant Information</h2>
            <button
              onClick={() => setShowRestaurantForm(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FiEdit /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurant?.imageUrl && (
              <div className="md:col-span-2">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Basic Info</h3>
              <p className="text-gray-600 mb-1">Name: {restaurant?.name}</p>
              <p className="text-gray-600 mb-1">
                Cuisine: {restaurant?.cuisineType}
              </p>
              <p className="text-gray-600">
                Status: {restaurant?.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
              <p className="text-gray-600 mb-1">
                Phone: {restaurant?.contact?.phone}
              </p>
              <p className="text-gray-600">
                Email: {restaurant?.contact?.email}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
              <p className="text-gray-600">
                {restaurant?.location?.address}, {restaurant?.location?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="text-gray-500 text-center py-8">
            No recent orders found.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;
