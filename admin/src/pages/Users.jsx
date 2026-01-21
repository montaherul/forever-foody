import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AdminContext, backendUrl } from "../config/adminConfig";
import { toast } from "react-toastify";
import { FiX, FiCamera } from "react-icons/fi";

const Users = () => {
  const { token } = useContext(AdminContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + "/api/user/admin/users", {
        headers: { token },
      });

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { data } = await axios.delete(
        backendUrl + "/api/user/admin/user/" + id,
        { headers: { token } },
      );

      if (data.success) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      jobTitle: user.jobTitle || "",
      company: user.company || "",
      location: user.location || "",
      profileImage: user.profileImage || "",
    });
    setPreviewImage(
      user.profileImage || "https://via.placeholder.com/150?text=No+Image",
    );
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormData({});
    setPreviewImage("");
  };

  const handleFormChange = (e) => {
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

  const updateUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const { data } = await axios.put(
        backendUrl + "/api/user/admin/user/" + editingUser,
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success("User updated successfully");
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser ? { ...u, ...formData } : u)),
        );
        closeEditModal();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* ================= HEADER ================= */}
        <div className="mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            👥 Users Management
          </h2>
          <p className="text-sm text-gray-600">
            View and control all registered users ({users.length})
          </p>
        </div>

        {/* ================= TABLE ================= */}
        {users.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">#</th>
                  <th className="py-3 px-4 text-left font-semibold">Picture</th>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Phone</th>
                  <th className="py-3 px-4 text-left font-semibold">Joined</th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((u, index) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{index + 1}</td>

                    <td className="py-3 px-4">
                      <img
                        src={
                          u.profileImage ||
                          "https://via.placeholder.com/40?text=No+Image"
                        }
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-900">
                      {u.name || "N/A"}
                    </td>

                    <td className="py-3 px-4 text-gray-700">{u.email}</td>

                    <td className="py-3 px-4 text-gray-600">
                      {u.phone || "-"}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="py-3 px-4 text-center space-x-2 flex justify-center">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      >
                        Edit
                      </button>
                      {!u.isAdmin && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                    <FiCamera size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Upload Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter phone"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter address"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter job title"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter company"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t justify-end">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
