import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { FiLogIn, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import loginBG from "../../images/auth/login1.svg";

const SystemAdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Logging you in...");
      await login(formData);
      toast.dismiss();
      toast.success("Welcome back!");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex pt-[60px] overflow-hidden">
      {/* Right Form Side */}
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="bg-yellow-400 text-black px-8 py-4 rounded-t-xl shadow-xl">
            <h1 className="text-4xl font-bold font-caveat flex items-center gap-2">
              Hela Eats Admin
            </h1>
            <h2 className="font-semibold hidden md:inline-block text-sm font-sans text-gray-700 mt-1">
              Welcome back –{" "}
              <span className="text-black">Admin Login to continue</span>
            </h2>
            <div className="mt-2 sm:hidden">
              <h2 className="text-xl font-semibold">Admin Portal Login</h2>
              <p className="text-sm text-gray-700">
                Manage and oversee the platform
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitAdmin} className="px-8 py-6 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                placeholder="you@example.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12 font-semibold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-lg hover:bg-zinc-600 transition-all duration-600 font-medium disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <ImSpinner8 className="animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login as Admin</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminLoginPage;
