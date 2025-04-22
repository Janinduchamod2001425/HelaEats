import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const SystemAdminSignUpPage = () => {
  const { signupAdmin, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("restaurant_admin");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        role: selectedRole,
      };

      toast.loading("Creating your account...");
      await signupAdmin(dataToSubmit);
      toast.dismiss();
      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 3000);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-20 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg">
        <div className="bg-black text-white px-8 py-4 rounded-t-xl shadow">
          <h1 className="text-4xl font-bold font-caveat">Hela Eats</h1>
          <h2 className="text-sm text-gray-300 font-sans mt-1">
            Create an account –{" "}
            <span className="text-yellow-100">
              Manage user data and system configurations efficiently
            </span>
          </h2>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
              >
                <option value="restaurant_admin">Restaurant Admin</option>
                <option value="delivery_personnel">Delivery Personnel</option>
                <option value="system_admin">System Admin</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                placeholder="Amélie Laurent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-black"
                placeholder="amelie@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-black pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition font-semibold flex items-center justify-center"
            >
              {isSigningUp ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminSignUpPage;
