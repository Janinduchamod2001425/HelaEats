// import { create } from "zustand";

// export const useCartStore = create((set, get) => ({
//   cart: [],
//   addItem: (item) => {
//     const existing = get().cart.find(
//       (i) => i.itemId === item.itemId && i.restaurantId === item.restaurantId
//     );
//     if (existing) {
//       set({
//         cart: get().cart.map((i) =>
//           i.itemId === item.itemId && i.restaurantId === item.restaurantId
//             ? { ...i, quantity: i.quantity + item.quantity }
//             : i
//         ),
//       });
//     } else {
//       set({ cart: [...get().cart, item] });
//     }
//   },
//   removeItem: (itemId, restaurantId) => {
//     set({
//       cart: get().cart.filter(
//         (i) => !(i.itemId === itemId && i.restaurantId === restaurantId)
//       ),
//     });
//   },
//   updateItem: (itemId, restaurantId, quantity) => {
//     set({
//       cart: get().cart.map((i) =>
//         i.itemId === itemId && i.restaurantId === restaurantId
//           ? { ...i, quantity }
//           : i
//       ),
//     });
//   },
//   clearCart: () => set({ cart: [] }),
// }));

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],
//       addItem: (item) => {
//         if (!item.itemId || !item.restaurantId) {
//           console.error("Invalid item data");
//           return;
//         }

//         const existing = get().cart.find(
//           (i) =>
//             i.itemId === item.itemId && i.restaurantId === item.restaurantId
//         );

//         if (existing) {
//           set({
//             cart: get().cart.map((i) =>
//               i.itemId === item.itemId && i.restaurantId === item.restaurantId
//                 ? { ...i, quantity: i.quantity + (item.quantity || 1) }
//                 : i
//             ),
//           });
//         } else {
//           set({
//             cart: [...get().cart, { ...item, quantity: item.quantity || 1 }],
//           });
//         }
//       },

//       removeItem: (itemId, restaurantId) => {
//         set({
//           cart: get().cart.filter(
//             (i) => !(i.itemId === itemId && i.restaurantId === restaurantId)
//           ),
//         });
//       },

//       updateItem: (itemId, restaurantId, quantity) => {
//         if (quantity < 1) {
//           get().removeItem(itemId, restaurantId);
//           return;
//         }

//         set({
//           cart: get().cart.map((i) =>
//             i.itemId === itemId && i.restaurantId === restaurantId // Fixed: was using item.restaurantId
//               ? { ...i, quantity }
//               : i
//           ),
//         });
//       },

//       clearCart: () => set({ cart: [] }),

//       getCartTotal: () => {
//         return get().cart.reduce((total, item) => {
//           return total + item.price * item.quantity;
//         }, 0);
//       },

//       getItemCount: () => {
//         return get().cart.reduce((count, item) => count + item.quantity, 0);
//       },

//       getRestaurantId: () => {
//         return get().cart[0]?.restaurantId || null;
//       },
//     }),
//     {
//       name: "hela-eats-cart",
//       getStorage: () => localStorage,
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosOrderInstance } from "../lib/axios"; // Add this import

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addItem: async (item) => {
        if (!item.itemId || !item.restaurantId) {
          console.error("Invalid item data");
          return;
        }

        try {
          // Make API call to backend
          await axiosOrderInstance.post(
            `/api/cart/${item.restaurantId}/items`,
            {
              itemId: item.itemId,
              quantity: item.quantity || 1,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
            }
          );

          // Update local state after successful API call
          const existing = get().cart.find(
            (i) =>
              i.itemId === item.itemId && i.restaurantId === item.restaurantId
          );

          if (existing) {
            set({
              cart: get().cart.map((i) =>
                i.itemId === item.itemId && i.restaurantId === item.restaurantId
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            });
          } else {
            set({
              cart: [...get().cart, { ...item, quantity: item.quantity || 1 }],
            });
          }
        } catch (error) {
          console.error("Failed to add item to cart:", error);
          throw error;
        }
      },

      updateItem: async (itemId, restaurantId, quantity) => {
        try {
          // Make API call to backend
          await axiosOrderInstance.put(
            `/api/cart/${restaurantId}/items/${itemId}`,
            {
              quantity,
            }
          );

          // Update local state after successful API call
          if (quantity < 1) {
            get().removeItem(itemId, restaurantId);
            return;
          }

          set({
            cart: get().cart.map((i) =>
              i.itemId === itemId && i.restaurantId === restaurantId
                ? { ...i, quantity }
                : i
            ),
          });
        } catch (error) {
          console.error("Failed to update item quantity:", error);
          throw error;
        }
      },

      removeItem: async (itemId, restaurantId) => {
        try {
          // Make API call to backend
          await axiosOrderInstance.delete(
            `/api/cart/${restaurantId}/items/${itemId}`
          );

          // Update local state after successful API call
          set({
            cart: get().cart.filter(
              (i) => !(i.itemId === itemId && i.restaurantId === restaurantId)
            ),
          });
        } catch (error) {
          console.error("Failed to remove item:", error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          // Make API call to backend
          await axiosOrderInstance.delete("/api/cart");

          // Clear local state after successful API call
          set({ cart: [] });
        } catch (error) {
          console.error("Failed to clear cart:", error);
          throw error;
        }
      },

      // Add this new method
      resetStore: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        return get()
          .cart.reduce((total, item) => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity);
            return total + price * quantity;
          }, 0)
          .toFixed(2);
      },

      // get the cart count
      getCartCount: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "hela-eats-cart",
      getStorage: () => localStorage,
    }
  )
);
