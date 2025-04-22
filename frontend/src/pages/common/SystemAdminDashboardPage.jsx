import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore.js";

const SystemAdminDashboardPage = () => {
  const { authUser, completeProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="mt-28 flex flex-row items-center gap-3 justify-center">
      <Link
        to="/admin/signup"
        className="px-8 py-2 border-white bg-yellow-400 text-black rounded-3xl font-semibold transition-all duration-300 transform border border-transparent hover:bg-white hover:border-black hover:text-black ml-5"
      >
        Admin Signup
      </Link>

      <button
        onClick={handleLogout}
        className="text-sm text-white font-comfort bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
};
export default SystemAdminDashboardPage;
