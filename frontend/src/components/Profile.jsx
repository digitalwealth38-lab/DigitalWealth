import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader, Lock } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import avatarpng from "../assets/avatar.png";

export default function ProfilePage() {
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    checkAuth,
    isCheckingAuth,
    updateProfileData,
    isUpdatingProfileData
  } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    oldPassword: "",
    newPassword: "",
  });
  const [selectedImg, setSelectedImg] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch auth user when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set form values when user loads
  useEffect(() => {
    if (authUser) {
      setForm({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [authUser]);
console.log(authUser)
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileData(form);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result;
    setSelectedImg(base64Image); // Instantly show preview

    try {
      await updateProfile({ profilePic: base64Image }); // Update backend
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  };
  reader.readAsDataURL(file); // Convert image to base64
};


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-sky-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-16 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Profile <span className="text-sky-500">Settings</span>
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE - Profile Info */}
      
      
      <motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-sky-50 rounded-2xl shadow-lg p-8 border border-sky-100 hover:shadow-sky-200 transition-all duration-300"
>
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

  <div className="flex flex-col items-center relative z-10">
    <div className="relative group">
      <img
        src={selectedImg || authUser?.profilePic || avatarpng}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-sky-500 shadow-lg group-hover:scale-105 transition-transform duration-300"
      />
      <label
        htmlFor="avatar-upload"
        className={`absolute bottom-2 right-2 bg-sky-600 hover:bg-sky-700 p-2 rounded-full cursor-pointer transition ${
          isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
        }`}
      >
        <Camera className="w-5 h-5 text-white" />
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUpdatingProfile}
        />
      </label>
    </div>

    <h2 className="text-2xl font-bold mt-5 text-sky-800">{authUser?.name}</h2>
    <p
      className={`text-sm font-semibold mb-6 px-4 py-1.5 rounded-full ${
        authUser?.isAdmin
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {authUser?.isAdmin ? "Admin" : "Member"}
    </p>
  </div>

  {/* Fancy info grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center text-gray-700">
    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Member ID</p>
      <p className="font-semibold text-sky-700 truncate">{authUser?._id || "-"}</p>
    </div>
    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Joined</p>
      <p className="font-semibold text-sky-700">
        {authUser?.createdAt
          ? new Date(authUser.createdAt).toLocaleDateString()
          : "-"}
      </p>
    </div>
    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Sponsor ID</p>
      <p className="font-semibold text-sky-700">{authUser?.referredBy || "-"}</p>
    </div>
    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Rank</p>
      <p className="font-semibold text-sky-700">{authUser?.rank || "Bronze"}</p>
    </div>

    {/* ✅ FIXED EMAIL CARD */}
    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Email</p>
      <p
        className="font-semibold text-sky-700 break-words text-sm max-w-[140px] mx-auto"
        style={{ wordBreak: "break-word" }}
      >
        {authUser?.email}
      </p>
    </div>

    <div className="bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">Status</p>
      <p className="font-semibold text-green-600">Active</p>
    </div>
  </div>

  {/* Contact Info */}
  <div className="mt-8 bg-white/70 rounded-xl p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-sky-700 mb-3">Contact Information</h3>
    <p>
      <b>Phone:</b> {authUser?.phone || "Not added"}
    </p>
    <p>
      <b>Address:</b> {authUser?.address || "Not added"}
    </p>
  </div>
</motion.div>


        {/* RIGHT SIDE - Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">
            Account Settings
          </h2>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-green-600 text-center"
            >
              {message}
            </motion.p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Info Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 border rounded-xl bg-sky-50 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-sky-700 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full mt-4 focus:ring-2 focus:ring-sky-400"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full mt-4 focus:ring-2 focus:ring-sky-400"
              />
            </motion.div>

            {/* Password Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 border rounded-xl bg-sky-50 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-sky-700 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-sky-700" /> Change Password
              </h3>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={form.oldPassword}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full mb-3 focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-sky-400"
              />
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              disabled={isUpdatingProfileData}
              className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition w-full shadow-md"
            >
              {isUpdatingProfileData ? "Saving..." : "Save Changes"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

