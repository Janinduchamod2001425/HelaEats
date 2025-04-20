import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...formData,
        role: "customer",
      };
      await toast.promise(
        signup(customerData),
        {
          loading: "Creating your account...",
          success: () => {
            navigate("/profile");
            return "Account created successfully!";
          },
          error: (error) => error.response?.data?.message || "Signup failed",
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 3000,
          },
        },
      );
    } catch (error) {
      // Error already handled by toast.promise
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-[60px]">
      {/* Left Side - Banner Image */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="/HelaEatsMask.svg"
          alt="Hela Eats Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Hela Eats</h1>
            <p className="text-xl">
              Discover the best food delivery experience in Sri Lanka
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-8 py-6">
            <h1 className="text-2xl font-bold">Hela Eats</h1>
            <div className="mt-2">
              <h2 className="text-xl font-semibold">Create an account</h2>
              <p className="text-gray-300 text-sm mt-1">
                Sign up and get 10% off your first order
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="amélielaurent@gmail.com"
                  />
                  {formData.email && !/\S+@\S+\.\S+/.test(formData.email) && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="col-span-1 md:col-span-2">
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  {formData.password && formData.password.length < 6 && (
                    <p className="text-xs text-red-500 mt-1">
                      Password must be at least 6 characters.
                    </p>
                  )}
                  {formData.password.length >= 6 && (
                    <p className="text-xs text-green-600 mt-1">
                      Strong password ✔
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact (Optional)
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="07XXXXXXXX"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Optional – used for delivery updates.
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="123, Colombo"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-200 font-medium disabled:opacity-70"
                >
                  {isSigningUp ? (
                    <>
                      <ImSpinner8 className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Have an account?{" "}
                <Link
                  to="/login"
                  className="text-black font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="mt-2 text-xs">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-black hover:underline">
                  Terms & Conditions
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
