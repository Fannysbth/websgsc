"use client";

import { useState, useEffect, useRef } from "react"; // Tambahkan useRef
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", 
    phone: "", 
    location: "" 
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/me`,
          { withCredentials: true }
        );
        
        setUser(res.data.user);
        setFormData({
          username: res.data.user.username || "",
          phone: res.data.user.phone || "",
          location: res.data.user.location || "",
        });
      } catch (err) {
        console.error("User not found. Please login again.", err);
        setUser(null);
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fungsi untuk upload foto
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/profile/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        alert('Profile picture updated successfully!');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fungsi untuk edit profile (tetap sama)
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/profile/edit`,
        formData,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setUser(res.data.user);
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ... kode lainnya tetap sama

  return (
    <div className="flex min-h-screen bg-yellow-25">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#004b00] text-white shadow-lg">
        {/* ... sidebar code sama ... */}
      </div>

      {/* Main */}
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#004b00]">Profile</h1>
          <div className="flex gap-2">
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-8 mb-10">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={user.profilePic || "/default.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg cursor-pointer block"
              >
                {uploading ? "Uploading..." : "Change Photo"}
              </label>
              <p className="text-sm text-gray-600 mt-1">Max 5MB</p>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="bg-gray-200 rounded-xl p-6 flex-1 shadow-md">
            {editing ? (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-2 rounded border"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="p-2 rounded border"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="p-2 rounded border"
                />
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "-"}</p>
                <p><strong>Location:</strong> {user.location || "-"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}