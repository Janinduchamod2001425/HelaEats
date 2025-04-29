import { useCartStore } from "../../store/useCartStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateItem);
  // const getCartTotal = useCartStore((state) => state.getCartTotal);

  // Calculate total directly in the component
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        // Ensure both price and quantity are numbers
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        const itemTotal = price * quantity;
        console.log(
          `Item: ${item.name}, Price: ${price}, Qty: ${quantity}, Total: ${itemTotal}`
        );
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  };

  console.log("Cart total:", calculateTotal());

  const handleQuantityUpdate = async (itemId, restaurantId, newQuantity) => {
    try {
      await updateItem(itemId, restaurantId, Math.max(1, newQuantity));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-4">
          Add some delicious items to your cart!
        </p>
        <Link
          to="/"
          className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow">
        {cart.map((item) => (
          <div
            key={item.itemId}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Rs. {item.price.toFixed(2)} each
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleQuantityUpdate(
                      item.itemId,
                      item.restaurantId,
                      item.quantity - 1
                    )
                  }
                  className="px-2 py-1 border rounded-l hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleQuantityUpdate(item.itemId, item.restaurantId, value);
                  }}
                  className="w-16 px-2 py-1 border-y text-center [appearance:textfield]"
                />
                <button
                  onClick={() =>
                    handleQuantityUpdate(
                      item.itemId,
                      item.restaurantId,
                      item.quantity + 1
                    )
                  }
                  className="px-2 py-1 border rounded-r hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-medium">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.itemId, item.restaurantId)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">Rs. {calculateTotal()}</span>
          </div>

          <div className="flex gap-4">
            <Link
              to="/"
              className="px-6 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
