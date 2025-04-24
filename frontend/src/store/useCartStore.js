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

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (item) => {
        if (!item.itemId || !item.restaurantId) {
          console.error("Invalid item data");
          return;
        }

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
      },

      removeItem: (itemId, restaurantId) => {
        set({
          cart: get().cart.filter(
            (i) => !(i.itemId === itemId && i.restaurantId === restaurantId)
          ),
        });
      },

      updateItem: (itemId, restaurantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId, restaurantId);
          return;
        }

        set({
          cart: get().cart.map((i) =>
            i.itemId === itemId && i.restaurantId === restaurantId // Fixed: was using item.restaurantId
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      getRestaurantId: () => {
        return get().cart[0]?.restaurantId || null;
      },
    }),
    {
      name: "hela-eats-cart",
      getStorage: () => localStorage,
    }
  )
);
