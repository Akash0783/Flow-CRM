// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import api from "../api";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put(
        "/api/profile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border rounded p-2"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2"
        />
        <input
          type="text"
          name="avatar"
          value={user.avatar}
          onChange={handleChange}
          placeholder="Avatar URL"
          className="border rounded p-2"
        />

        <button
          onClick={handleSave}
          className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
        >
          Save Changes
        </button>
      </div>

      {user.avatar && (
        <div className="mt-6 text-center">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover"
          />
          <p className="mt-2 text-gray-600">{user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
