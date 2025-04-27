import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSave, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import signupBG from "../../images/auth/signup1.svg";

const getRequiredFields = (role) => {
  const fieldMap = {
    customer: ["contact", "address"],
    restaurant_admin: ["restaurantId", "contact"],
    delivery_personnel: ["vehicleNumber", "contact", "status", "location"],
    system_admin: ["contact"],
  };
  return fieldMap[role] || [];
};

const fieldLabels = {
  contact: "Contact Number",
  address: "Delivery Address",
  restaurantId: "Restaurant ID",
  vehicleNumber: "Vehicle Number",
  status: "Availability Status",
  location: "Current Location",
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "on_delivery", label: "On Delivery" },
  { value: "offline", label: "Offline" },
];

const ProfilePage = () => {
  const { authUser, completeProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    if (authUser) {
      const fields = getRequiredFields(authUser.role);
      const initialData = {};
      fields.forEach((field) => {
        initialData[field] = authUser[field] || "";
      });

      // Initialize location coordinates if they exist
      if (authUser.location?.coordinates) {
        setLocationCoords({
          lat: authUser.location.coordinates[1],
          lng: authUser.location.coordinates[0],
        });
      }

      setFormData(initialData);
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setLocationCoords({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(latitude, longitude);
          toast.success("Location updated successfully");
        },
        (error) => {
          toast.error("Could not get your location: " + error.message);
        },
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await completeProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!authUser) return <div className="p-4">Loading profile...</div>;

  const editableFields = getRequiredFields(authUser.role);

  return (
    <div className="min-h-screen bg-gray-50 flex pt-[60px] overflow-hidden">
      <div className="hidden lg:block w-1/2">
        <img
          src={signupBG}
          alt="Profile Illustration"
          className="w-[635px] h-[635px]"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:ml-[-70px] mt-14 sm:mt-0">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg">
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

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fixed Fields */}
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

              {/* Dynamic Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4">
                {editableFields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldLabels[field] || field}
                    </label>
                    {isEditing ? (
                      field === "status" ? (
                        <select
                          name="status"
                          value={formData.status || ""}
                          onChange={handleStatusChange}
                          required
                          className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field === "location" ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={
                                locationCoords.lat
                                  ? locationCoords.lat.toFixed(6)
                                  : ""
                              }
                              readOnly
                              placeholder="Latitude"
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                            />
                            <input
                              type="text"
                              value={
                                locationCoords.lng
                                  ? locationCoords.lng.toFixed(6)
                                  : ""
                              }
                              readOnly
                              placeholder="Longitude"
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
                          >
                            Use Current Location
                          </button>
                          <p className="text-xs text-gray-500">
                            Note: Location is automatically set when you click
                            the button
                          </p>
                        </div>
                      ) : field === "address" ? (
                        <textarea
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={`Enter ${fieldLabels[field] || field}`}
                        />
                      ) : (
                        <input
                          type="text"
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border bg-amber-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={`Enter ${fieldLabels[field] || field}`}
                        />
                      )
                    ) : field === "status" ? (
                      <input
                        type="text"
                        value={
                          statusOptions.find(
                            (opt) => opt.value === authUser[field],
                          )?.label || "Not provided"
                        }
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                      />
                    ) : field === "location" ? (
                      <input
                        type="text"
                        value={
                          authUser[field]?.coordinates
                            ? `${authUser[field].coordinates[1].toFixed(4)}, ${authUser[field].coordinates[0].toFixed(4)}`
                            : "Not provided"
                        }
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                      />
                    ) : (
                      <input
                        type="text"
                        value={authUser[field] || "Not provided"}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed font-semibold"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Buttons */}
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
