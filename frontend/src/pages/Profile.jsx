import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl, token, user, setUser, navigate, authChecked, logout } =
    useContext(ShopContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
    phone: "",
    address: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",
    deliveryCountry: "",
    deliveryAltLabel: "",
    deliveryAltStreet: "",
    deliveryAltCity: "",
    deliveryAltState: "",
    deliveryAltZipcode: "",
    deliveryAltCountry: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !token) {
      navigate("/login");
    }
  }, [authChecked, token, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
        phone: user.phone || "",
        address: user.address || "",
        deliveryStreet: user.deliveryStreet || "",
        deliveryCity: user.deliveryCity || "",
        deliveryState: user.deliveryState || "",
        deliveryZipcode: user.deliveryZipcode || "",
        deliveryCountry: user.deliveryCountry || "",
        deliveryAltLabel: user.deliveryAltLabel || "",
        deliveryAltStreet: user.deliveryAltStreet || "",
        deliveryAltCity: user.deliveryAltCity || "",
        deliveryAltState: user.deliveryAltState || "",
        deliveryAltZipcode: user.deliveryAltZipcode || "",
        deliveryAltCountry: user.deliveryAltCountry || "",
      });
      setPreviewImage(
        user.profileImage || "https://via.placeholder.com/150?text=Profile"
      );
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile/update",
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          deliveryStreet: formData.deliveryStreet,
          deliveryCity: formData.deliveryCity,
          deliveryState: formData.deliveryState,
          deliveryZipcode: formData.deliveryZipcode,
          deliveryCountry: formData.deliveryCountry,
          deliveryAltLabel: formData.deliveryAltLabel,
          deliveryAltStreet: formData.deliveryAltStreet,
          deliveryAltCity: formData.deliveryAltCity,
          deliveryAltState: formData.deliveryAltState,
          deliveryAltZipcode: formData.deliveryAltZipcode,
          deliveryAltCountry: formData.deliveryAltCountry,
          profileImage: formData.profileImage,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.round(
    (Object.values(formData).filter((val) => val && val.length > 0).length /
      Object.keys(formData).length) *
      100
  );

  return (
    <div className="border-t pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"MY"} text2={"PROFILE"} />
        </div>

        {/* Main Profile Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-20">
              {/* Profile Cover */}
              <div className="h-24 bg-gradient-to-r from-green-600 to-green-700"></div>

              {/* Profile Picture */}
              <div className="relative px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 cursor-pointer transition-colors shadow-md">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center mt-4 w-full">
                    <h2 className="text-lg font-bold text-gray-900">
                      {formData.name}
                    </h2>
                    <p className="text-sm text-green-600 font-semibold">
                      Customer
                    </p>
                  </div>

                  {/* Profile Completion */}
                  <div className="w-full mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-600">
                        Profile Completion
                      </span>
                      <span className="text-xs font-bold text-green-600">
                        {completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Edit Profile
                    </button>
                    
                  ) : (
                    <div className="w-full flex gap-2 mt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {/* logout button */} 
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to logout?')) {
                        logout();
                      }
                    }}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </div>

                {/* Contact Quick Links */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  {formData.email && (
                    <a
                      href={`mailto:${formData.email}`}
                      className="flex items-center text-sm text-gray-600 hover:text-green-600"
                    >
                      <span className="mr-2"></span>
                      <span className="truncate">{formData.email}</span>
                    </a>
                  )}
                  {formData.phone && (
                    <a
                      href={`tel:${formData.phone}`}
                      className="flex items-center text-sm text-gray-600 hover:text-green-600"
                    >
                      <span className="mr-2"></span>
                      {formData.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 bg-white rounded-t-xl px-6 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "contact", label: "Contact" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-lg p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 py-3 font-semibold text-lg">
                        {formData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="text-gray-900 py-3 font-semibold text-lg">
                      {formData.email}
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t mt-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {user?.totalOrders || 0}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Total Orders</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {completionPercentage}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Profile Complete
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">⭐</p>
                      <p className="text-xs text-gray-600 mt-1">Verified</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="+1 (555) 000-0000"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 font-semibold">
                          {formData.phone || "Not added"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="deliveryCity"
                          value={formData.deliveryCity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="City"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 font-semibold">
                          {formData.deliveryCity || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="deliveryStreet"
                        value={formData.deliveryStreet}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="123 Main St"
                      />
                    ) : (
                      <p className="text-gray-600 py-3">
                        {formData.deliveryStreet || "Not added"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        State/Province
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="deliveryState"
                          value={formData.deliveryState}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="State or Province"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 font-semibold">
                          {formData.deliveryState || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Postal Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="deliveryZipcode"
                          value={formData.deliveryZipcode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Zip or Postal"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 font-semibold">
                          {formData.deliveryZipcode || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="deliveryCountry"
                        value={formData.deliveryCountry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Country"
                      />
                    ) : (
                      <p className="text-gray-900 py-3 font-semibold">
                        {formData.deliveryCountry || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Secondary Address */}
                  <div className="pt-6 mt-2 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          Secondary Address (optional)
                        </p>
                        <p className="text-xs text-gray-500">
                          Save an alternate address (e.g., work or family)
                        </p>
                      </div>
                      {formData.deliveryAltLabel && !isEditing && (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                          {formData.deliveryAltLabel}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Label
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="deliveryAltLabel"
                            value={formData.deliveryAltLabel}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="e.g., Work, Parents"
                          />
                        ) : (
                          <p className="text-gray-900 py-3 font-semibold">
                            {formData.deliveryAltLabel || "Not set"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="deliveryAltCity"
                            value={formData.deliveryAltCity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="City"
                          />
                        ) : (
                          <p className="text-gray-900 py-3 font-semibold">
                            {formData.deliveryAltCity || "Not specified"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Street Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="deliveryAltStreet"
                          value={formData.deliveryAltStreet}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="456 Market Rd"
                        />
                      ) : (
                        <p className="text-gray-600 py-3">
                          {formData.deliveryAltStreet || "Not added"}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          State/Province
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="deliveryAltState"
                            value={formData.deliveryAltState}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="State or Province"
                          />
                        ) : (
                          <p className="text-gray-900 py-3 font-semibold">
                            {formData.deliveryAltState || "Not specified"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Postal Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="deliveryAltZipcode"
                            value={formData.deliveryAltZipcode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="Zip or Postal"
                          />
                        ) : (
                          <p className="text-gray-900 py-3 font-semibold">
                            {formData.deliveryAltZipcode || "Not specified"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="deliveryAltCountry"
                          value={formData.deliveryAltCountry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Country"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 font-semibold">
                          {formData.deliveryAltCountry || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Profile;
