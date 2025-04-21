import { useState } from "react";
import { MapPin, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isDelivery, setIsDelivery] = useState(true);
  const [cartCount] = useState(0); // Make dynamic later
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 md:px-6 py-3 shadow-md bg-white flex flex-wrap items-center justify-between fixed top-0 left-0 z-50">
      {/* Left: Menu + Logo + Toggle */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto mb-3 sm:mb-0">
        <Menu className="w-6 h-6 cursor-pointer" />

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="sm:text-lg md:text-xl text-md font-bold tracking-tight">
            <span className="font-bold">Hela</span>{" "}
            <span className="font-extrabold">Eats</span>
          </h1>
        </Link>

        {/*Delivery or Pickup*/}
        <div className="flex border rounded-full overflow-hidden text-sm font-medium ml-[130px] sm:ml-5 p-1 bg-gray-100">
          <button
            className={`px-3 py-1 sm:px-4 transition-all duration-300 ease-in-out rounded-full ${
              isDelivery ? "bg-black text-yellow-300" : "text-black"
            }`}
            onClick={() => setIsDelivery(true)}
          >
            Delivery
          </button>
          <button
            className={`px-3 py-1 sm:px-4 transition-all duration-300 ease-in-out rounded-full ${
              !isDelivery ? "bg-black text-yellow-300" : " text-black"
            }`}
            onClick={() => setIsDelivery(false)}
          >
            Pickup
          </button>
        </div>
      </div>

      {/* Middle: Location + Search */}
      <div className="flex items-center gap-2 flex-grow max-w-full sm:max-w-2xl md:max-w-4xl mx-auto">
        <div className="hidden sm:flex items-center text-sm text-gray-700 mr-2 whitespace-nowrap font-bold">
          <MapPin className="w-5 h-5" />
          <span className="ml-1">Kalegana, Galle</span>
          <span className="mx-1">·</span>
          <span>Now ▾</span>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl flex items-center bg-gray-100 px-3 py-2 rounded-full font-semibold">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Hela Eats"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right: Cart + Profile */}
      <div className="flex items-center gap-5 mt-3 sm:mt-0">
        <div className="relative">
          <ShoppingCart
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/cart")}
          />
          <span className="absolute -top-2 -right-2 bg-yellow-300 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </div>
        <User
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

export default Navbar;
