import React from "react";
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

import promo1 from "../../images/home/promo1.svg";
import promo2 from "../../images/home/promo2.jpg";
import promo3 from "../../images/home/promo3.jpg";
import promo4 from "../../images/home/promo4.jpg";

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

const HomePage = () => {
  return (
    <div className="bg-white sm:pt-[80px] sm:p-5 mt-32 sm:mt-0">
      {/* Top categories */}
      <div className="flex overflow-x-auto gap-6 px-4 py-2 mb-3">
        {[
          "Grocery",
          "Breakfast",
          "Coffee",
          "Pizza",
          "Burgers",
          "Convenience",
          "Soup",
          "Indian",
          "American",
          "Korean",
          "Japanese",
          "Chinese",
          "Asian",
          "Smoothie",
          "Healthy",
          "BBQ",
          "BubbleTea",
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-sm font-comfort min-w-[60px] group cursor-pointer"
          >
            <div className="p-1 rounded-full group-hover:bg-yellow-200 transition duration-500 ease-in-out">
              <img
                src={`/icons/${item}.png`}
                alt={item}
                className="w-14 h-14 object-contain"
              />
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 px-4 py-3 sm:mb-2">
        {filters.map((filter, index) => (
          <button
            key={index}
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
            alt="Promo"
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
              Use Promo : CB650
            </div>
          </div>
          <img
            src={promo2}
            alt="Promo"
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
            alt="Promo"
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
            alt="Promo"
            className="w-20 h-20 object-contain ml-4 rounded-md"
          />
        </div>
      </div>

      {/* Speedy deliveries */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-semibold mb-2">Speedy deliveries</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "P&S", rating: 4.6, reviews: 480 },
            { name: "HND Foods", rating: 4.6, reviews: 500 },
            { name: "Mamas Bakery and Cakery", rating: 4.6, reviews: 48 },
            { name: "Star Fast Food", rating: 3.9, reviews: 96 },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg overflow-hidden"
            >
              <div className="h-32 bg-gray-100" />
              {/* Image placeholder */}
              <div className="p-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ⭐ {item.rating} ({item.reviews}+) • 15 min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speedy deliveries */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-semibold mb-2">Speedy deliveries</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "P&S", rating: 4.6, reviews: 480 },
            { name: "HND Foods", rating: 4.6, reviews: 500 },
            { name: "Mamas Bakery and Cakery", rating: 4.6, reviews: 48 },
            { name: "Star Fast Food", rating: 3.9, reviews: 96 },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg overflow-hidden"
            >
              <div className="h-32 bg-gray-100" />
              {/* Image placeholder */}
              <div className="p-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ⭐ {item.rating} ({item.reviews}+) • 15 min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
