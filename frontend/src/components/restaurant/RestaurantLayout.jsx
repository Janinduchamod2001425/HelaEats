import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiMenu, FiShoppingBag, FiSettings } from "react-icons/fi";

const RestaurantLayout = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    {
      path: "/restaurantadmin/dashboard",
      name: "Dashboard",
      icon: <FiHome size={20} />,
    },
    {
      path: "/restaurantadmin/menu",
      name: "Menu",
      icon: <FiMenu size={20} />,
    },
    {
      path: "/restaurantadmin/orders",
      name: "Orders",
      icon: <FiShoppingBag size={20} />,
    },
    {
      path: "/restaurantadmin/settings",
      name: "Settings",
      icon: <FiSettings size={20} />,
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 pt-16">
      {" "}
      {/* pt-16 to account for top navbar */}
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed h-full">
        <div className="flex flex-col h-full">
          <div className="space-y-3 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActivePath(link.path)
                    ? "bg-yellow-100 text-yellow-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">{children}</div>
    </div>
  );
};

export default RestaurantLayout;
