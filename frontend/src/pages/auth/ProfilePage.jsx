import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSave, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

import signupBG from "../../images/auth/signup1.svg";

const ProfilePage = () => {
  const { authUser, completeProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        contact: authUser.contact || "",
        address: authUser.address || "",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await completeProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!authUser) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pt-[60px] overflow-hidden">
      {/* Left-side placeholder (if needed for symmetry) */}
      <div className="hidden lg:block w-1/2">
        <img
          src={signupBG}
          alt="Profile Illustration"
          className="w-[635px] h-[635px]"
        />
      </div>

      {/* Right-side form container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:ml-[-70px] mt-14 sm:mt-0">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="bg-black text-white px-8 py-4 rounded-xl shadow-xl flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-caveat">Hela Eats</h1>
              <h2 className="text-sm text-gray-300 mt-1">
                Welcome back! Manage your profile below
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-white font-comfort bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Profile Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Read-Only Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={authUser.name}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={authUser.email}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={authUser.role.replace("_", " ")}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed capitalize font-semibold"
                  />
                </div>
              </div>

              {/* Editable Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="07X XXX XXXX"
                    />
                  ) : (
                    <input
                      type="text"
                      value={authUser.contact || "Not provided"}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="123, Street, City"
                    />
                  ) : (
                    <textarea
                      value={authUser.address || "Not provided"}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-medium"
                    >
                      <FiSave /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
