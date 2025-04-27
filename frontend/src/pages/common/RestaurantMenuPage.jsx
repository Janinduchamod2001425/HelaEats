import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurantStore } from '../../store/useRestaurantStore';

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams();
  const { menuItems, loading, error, fetchMenuItems } = useRestaurantStore();

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems(restaurantId);
    }
  }, [restaurantId, fetchMenuItems]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading menu...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

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
            <div key={item._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Image Section */}
              <div className="h-48 bg-gray-100 relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-food.jpg';
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
                  <span className="font-medium text-yellow-600">LKR{item.price.toFixed(2)}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                {/* Black Add to Cart Button */}
                <button 
                  className={`w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
                    !item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => console.log(`Add ${item.name} to cart`)}
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