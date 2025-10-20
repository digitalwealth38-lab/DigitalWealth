import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminAddPackage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    levelRewardPercent: "",
    commissions: { level1: "", level2: "", level3: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("level")) {
      setFormData((prev) => ({
        ...prev,
        commissions: { ...prev.commissions, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/admin/package",
        {
          name: formData.name,
          price: Number(formData.price),
          commissions: {
            level1: Number(formData.commissions.level1),
            level2: Number(formData.commissions.level2),
            level3: Number(formData.commissions.level3),
          },
          levelRewardPercent: Number(formData.levelRewardPercent),
        },
        { withCredentials: true }
      );

      toast.success("✅ Package added successfully!");
      setFormData({
        name: "",
        price: "",
        levelRewardPercent: "",
        commissions: { level1: "", level2: "", level3: "" },
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add package");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-12">
      
      <h1 className="text-4xl font-extrabold text-sky-700 mb-6 text-center">
        ⚙️ Admin – Add Packages
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-10 text-center">
        Add New Package
      </h2>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Package Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter package name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Commissions (%)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="number"
                name="level1"
                placeholder="Level 1"
                value={formData.commissions.level1}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
                required
              />
              <input
                type="number"
                name="level2"
                placeholder="Level 2"
                value={formData.commissions.level2}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
                required
              />
              <input
                type="number"
                name="level3"
                placeholder="Level 3"
                value={formData.commissions.level3}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Level Reward Percent
            </label>
            <input
              type="number"
              name="levelRewardPercent"
              placeholder="Enter level reward %"
              value={formData.levelRewardPercent || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  levelRewardPercent: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 hover:scale-105"
          >
            Add Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddPackage;




