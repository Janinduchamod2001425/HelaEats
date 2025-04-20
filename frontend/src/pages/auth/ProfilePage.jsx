import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSave, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, completeProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contact: "",
    address: "",
  });

  // Initialize form with user data
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-[120px]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-yellow-400 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <div className="mt-1 text-lg font-medium">
                    {authUser.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="mt-1 text-lg font-medium">
                    {authUser.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Account Type
                  </label>
                  <div className="mt-1 text-lg font-medium capitalize">
                    {authUser.role.replace("_", " ")}
                  </div>
                </div>
              </div>

              {/* Editable Info */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    ) : (
                      <div className="mt-1 text-lg font-medium">
                        {authUser.contact || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Delivery Address
                    </label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    ) : (
                      <div className="mt-1 text-lg font-medium">
                        {authUser.address || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-medium"
                        >
                          <FiSave /> Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
