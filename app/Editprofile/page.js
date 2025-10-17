"use client";

import { useState, useEffect } from "react";

export default function EditProfilePage() {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data.user);
          setFormData(data.user);
          setProfilePic(data.user.profilePic || null);
        });
    }
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
        }),
      });
      const data = await res.json();
      if (data.success) setUserData(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("profilePic", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/api/users/profile/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (data.success) setProfilePic(data.user.profilePic);
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <img src={profilePic || "/default.png"} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
      <input type="file" onChange={handleFileUpload} className="mb-4" />

      <input
        type="text"
        value={formData.username || ""}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Username"
      />
      <input
        type="email"
        value={formData.email || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
      />
      <input
        type="text"
        value={formData.phone || ""}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Phone"
      />
      <input
        type="text"
        value={formData.location || ""}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Location"
      />

      <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        Save
      </button>
    </div>
  );
}
