import { useState } from "react";
import { MapPin, Menu, Search, ShoppingCart, User } from "lucide-react";

function Navbar() {
  const [isDelivery, setIsDelivery] = useState(true);
  const [cartCount] = useState(0); // You can make this dynamic later

  return (
    <div className="flex items-center justify-between px-6 py-3 shadow-md bg-white">
      {/* Left: Menu + Logo + Toggle */}
      <div className="flex items-center gap-4">
        <Menu className="w-6 h-6 cursor-pointer" />

        <h1 className="text-xl font-bold tracking-tight">
          <span className="font-bold">Hela</span>{" "}
          <span className="font-extrabold">Eats</span>
        </h1>

        <div className="flex border rounded-full overflow-hidden text-sm font-medium ml-5">
          <button
            className={`px-4 py-1 ${
              isDelivery ? "bg-black text-lime-300" : "bg-white text-black"
            }`}
            onClick={() => setIsDelivery(true)}
          >
            Delivery
          </button>
          <button
            className={`px-4 py-1 ${
              !isDelivery ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => setIsDelivery(false)}
          >
            Pickup
          </button>
        </div>
      </div>

      {/* Middle: Location + Time + Search */}
      <div className="flex items-center gap-3 flex-grow max-w-4xl mx-8">
        <div className="flex items-center gap-1 text-sm text-gray-700 mr-4 space-x-1">
          <MapPin className="w-6 h-6" />
          <span>Kalegana, Galle</span>
          <span className="mx-1">·</span>
          <span>Now ▾</span>
        </div>

        <div className="flex items-center flex-grow bg-gray-100 px-3 py-2 rounded-full">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Hela Eats"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right: Cart + Profile */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          {cartCount === 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          )}
        </div>
        <User className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;
