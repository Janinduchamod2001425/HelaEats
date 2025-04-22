import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUserPlus,
  FiSettings,
  FiUsers,
  FiHome,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore.js";

const SystemAdminDashboardPage = () => {
  const { authUser, completeProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiHome className="mr-2" /> Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Welcome, {authUser?.name || "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Admin Signup Card */}
          <Link
            to="/admin/signup"
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6 flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <FiUserPlus className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Role Registration
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Register new system administrators
                </p>
              </div>
            </div>
          </Link>

          {/* User Management Card (example) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  User Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage all system users
                </p>
              </div>
            </div>
          </div>

          {/* System Settings Card (example) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FiSettings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  System Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure platform settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section (example) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <FiUserPlus className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New admin registered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button className="text-sm font-medium text-yellow-600 hover:text-yellow-800">
              View all activity →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemAdminDashboardPage;
