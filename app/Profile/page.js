"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", phone: "" });

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const resUser = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/me`,
        { withCredentials: true }
      );

      let histories = [];
      try {
        const resHistories = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/histories`,
          { withCredentials: true }
        );
        histories = resHistories?.data?.histories || [];
      } catch (err) {
        console.warn("Histories fetch failed, using empty array.", err);
        histories = [];
      }

      setUser(resUser.data.user);
      setFormData({
        username: resUser.data.user.username || "",
        phone: resUser.data.user.phone || "",
      });
      setHistories(histories);
    } catch (err) {
      console.error("User not found. Please login again.", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      window.location.href = "/login";
    }
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/profile/edit`,
        formData,
        { withCredentials: true }
      );
      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!user) return <p className="p-8 text-red-600">User not found. Please login again.</p>;

  const menuItems = [
  { name: 'Dashboard', href: '/DashboardCharts' },
  { name: 'Data Kambing', href: '/DataKambing' },
  { name: 'Data THI', href: '/DataTHI' },
  { name: 'Data Suara', href: '/DataSuara' },
  { name: 'Profile', href: '/Profile' }
];

  return (
    <div className="flex min-h-screen bg-yellow-25">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#004b00] text-white shadow-lg">
        <div className="p-6 border-b border-yellow-700">
          <h1 className="text-2xl font-bold text-yellow-100">SCSC</h1>
          <p className="text-sm text-yellow-300 mt-1">Monitoring System</p>
        </div>
        <nav className="mt-4">
  {menuItems.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className="block px-6 py-3 hover:bg-yellow-700"
    >
      {item.name}
    </Link>
  ))}
</nav>
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
          <img
            src={user.profilePic || "/default.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
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
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone || "-"}
                </p>
                <p>
                  <strong>Location:</strong> {user.location || "-"}
                </p>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}
