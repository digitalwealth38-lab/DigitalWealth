import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    bankName: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me"); // replace with your endpoint
        setUser(res.data);
        setForm({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          dob: res.data.dob ? new Date(res.data.dob).toISOString().split("T")[0] : "",
          address: res.data.address || "",
          bankName: res.data.bankName || "",
          accountNumber: res.data.accountNumber || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put("/api/user/update", form); // update endpoint
      setMessage("Profile updated successfully!");
      setUser(res.data); // update left side info
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-50 p-8">
           <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Profile <span className="text-sky-500">Settings</span>
      </motion.h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Display Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center text-white text-2xl mb-4">
              {user.fullName?.[0]}
            </div>
            <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
            <p className="text-sm text-gray-500 mb-4">{user.role || "Member"}</p>
          </div>
          <div className="space-y-2 mt-4 text-gray-700">
            <p><b>Member ID:</b> {user.memberId}</p>
            <p><b>Join Date:</b> {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-"}</p>
            <p><b>Sponsor ID:</b> {user.sponsorId}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>Address:</b> {user.address}</p>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-sky-700 mb-6">Account Settings</h2>
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={form.dob}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={form.bankName}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={form.accountNumber}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition w-full"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
