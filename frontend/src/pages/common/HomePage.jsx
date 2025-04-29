import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "../../store/useRestaurantStore";
import {
  Percent,
  Truck,
  Timer,
  Star,
  ThumbsUp,
  DollarSign,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";

import promo1 from "../../images/home/promo1.svg";
import promo2 from "../../images/home/promo2.jpg";
import promo3 from "../../images/home/promo3.jpg";
import promo4 from "../../images/home/promo4.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const {
    restaurants = [],
    loading,
    error,
    fetchRestaurants,
  } = useRestaurantStore();
  const [activeCategory, setActiveCategory] = useState("All");

  // Debug: Log restaurants data when it changes
  useEffect(() => {
    console.log("Restaurants data:", restaurants);
  }, [restaurants]);

  // Get all unique cuisine types from restaurants
  const allCuisineTypes = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return [...new Set(restaurants.map((r) => r.cuisineType).filter(Boolean))];
  }, [restaurants]);

  // Enhanced filter function with case-insensitive comparison
  const filteredRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];

    if (activeCategory === "All") return restaurants;

    return restaurants.filter(
      (r) =>
        r.cuisineType &&
        r.cuisineType.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [restaurants, activeCategory]);

  // Fetch restaurants on component mount
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        await fetchRestaurants();
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        toast.error("Failed to load restaurants. Please try again later.");
      }
    };
    loadRestaurants();
  }, [fetchRestaurants]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  // Filter options
  const filters = [
    { label: "Offers", icon: <Percent size={16} /> },
    { label: "Delivery fee", icon: <Truck size={16} /> },
    { label: "Under 30 min", icon: <Timer size={16} /> },
    { label: "Highest rated", icon: <Star size={16} /> },
    { label: "Rating", icon: <ThumbsUp size={16} /> },
    { label: "Price", icon: <DollarSign size={16} /> },
    { label: "Dietary", icon: <Leaf size={16} /> },
    { label: "Sort", icon: <SlidersHorizontal size={16} /> },
  ];

  // Cuisine categories - dynamically include all available types plus "All"
  const categories = useMemo(() => {
    const uniqueCategories = ["All", ...allCuisineTypes];
    return uniqueCategories.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }, [allCuisineTypes]);

  // Enhanced empty state message
  const renderEmptyMessage = () => {
    if (loading) return null;

    if (restaurants.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No restaurants available in our system yet.
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No {activeCategory} restaurants found.</p>
        {allCuisineTypes.length > 0 && (
          <p className="text-sm text-gray-400 mt-2">
            Available cuisines: {allCuisineTypes.join(", ")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white sm:pt-[80px] sm:p-5 mt-32 sm:mt-0">
      {/* Top categories */}
      <div className="flex overflow-x-auto gap-6 px-4 py-2 mb-3">
        {categories.map((item, index) => (
          <button
            key={`${item}-${index}`}
            onClick={() => setActiveCategory(item)}
            className={`flex flex-col items-center text-sm font-comfort min-w-[60px] group cursor-pointer ${
              activeCategory === item ? "text-yellow-500 font-bold" : ""
            }`}
          >
            <div
              className={`p-1 rounded-full group-hover:bg-yellow-200 transition duration-500 ease-in-out ${
                activeCategory === item ? "bg-yellow-200" : ""
              }`}
            >
              <img
                src={`/icons/${item}.png`}
                alt={item}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.src = "/icons/default.png";
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
            <span>{item}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 px-4 py-3 sm:mb-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 rounded-full font-inter text-sm text-black hover:bg-amber-200 transition duration-200"
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Promo cards */}
      <div className="flex overflow-x-auto gap-4 px-4 py-2">
        {/* Promo Card 1 */}
        <div className="min-w-[300px] bg-amber-500 text-white p-4 rounded-lg flex justify-between items-start sm:w-[320px]">
          <div>
            <p className="font-bold">60% Off for New Users*</p>
            <p className="text-sm">
              Valid on your first 3 orders above Rs. 1,000 from selected …
            </p>
            <div className="bg-white text-black px-3 py-1 rounded-full inline-block mt-3 text-xs font-comfort font-semibold">
              Use Code: GALLE600
            </div>
          </div>
          <img
            src={promo1}
            alt="Promo 1"
            className="w-20 h-20 object-contain ml-4 rounded-md"
          />
        </div>

        {/* Promo Card 2 */}
        <div className="min-w-[300px] bg-gray-200 text-black p-4 rounded-lg flex justify-between items-start sm:w-[320px]">
          <div>
            <p className="font-bold">
              65% Off for New Users with Commercial Bank …
            </p>
            <p className="text-sm">
              Valid on the first 2 orders until 30 April*
            </p>
            <div className="bg-white text-black px-3 py-1 rounded-full inline-block mt-3 text-xs font-comfort font-semibold">
              Use Promo: CB650
            </div>
          </div>
          <img
            src={promo2}
            alt="Promo 2"
            className="w-20 h-20 object-contain ml-4 rounded-md"
          />
        </div>

        {/* Promo Card 3 */}
        <div className="min-w-[300px] bg-red-500 text-white p-4 rounded-lg flex justify-between items-start sm:w-[320px]">
          <div>
            <p className="font-bold">40% Off for New Users*</p>
            <p className="text-sm">
              Valid on your first 2 orders above Rs. 1,000 from selected …
            </p>
            <div className="bg-white text-black px-3 py-1 rounded-full inline-block mt-3 text-xs font-comfort font-semibold">
              Use Code: HELAEATSSL
            </div>
          </div>
          <img
            src={promo3}
            alt="Promo 3"
            className="w-20 h-20 object-contain ml-4 rounded-md"
          />
        </div>

        {/* Promo Card 4 */}
        <div className="min-w-[300px] bg-yellow-300 text-white p-4 rounded-lg flex justify-between items-start sm:w-[320px]">
          <div>
            <p className="font-bold text-black">70% Off for New Users*</p>
            <p className="text-sm text-gray-800">
              Valid on your first 4 orders above Rs. 4,000 from selected …
            </p>
            <div className="bg-white text-black px-3 py-1 rounded-full inline-block mt-3 text-xs font-comfort font-semibold">
              Use Code: HELAEATSSL
            </div>
          </div>
          <img
            src={promo4}
            alt="Promo 4"
            className="w-20 h-20 object-contain ml-4 rounded-md"
          />
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-semibold mb-2">
          {activeCategory === "All"
            ? "All Restaurants"
            : `${activeCategory} Restaurants`}
        </h2>

        {error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load restaurants. Please try again.
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          renderEmptyMessage()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleRestaurantClick(restaurant._id)}
                className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
              >
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/icons/default.png";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">
                      ⭐ {restaurant.rating || "New"}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500">
                      {restaurant.cuisineType}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-500">
                      {restaurant.location?.city}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {restaurant.isActive ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
