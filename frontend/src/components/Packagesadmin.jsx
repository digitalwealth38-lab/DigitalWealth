import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";
import Price from "./Price"; // adjust path if needed

import toast from "react-hot-toast";

const Packagesadmin = () => {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchPackages = async () => {
    try {
      const { data } = await axiosInstance.get("/packages");
      setPackages(data.packages);
    } catch (error) {
      toast.error("Failed to load packages");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      name: pkg.name,
      price: pkg.price,
      level1: pkg.commissions.level1,
      level2: pkg.commissions.level2,
      level3: pkg.commissions.level3,
      levelRewardPercent: pkg.levelRewardPercent,
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await axiosInstance.put(
        `/admin/${id}`,
        {
          name: formData.name,
          price: formData.price,
          commissions: {
            level1: formData.level1,
            level2: formData.level2,
            level3: formData.level3,
          },
          levelRewardPercent: formData.levelRewardPercent,
        },
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update package");
    }
  };

  // ✅ Delete package
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const { data } = await axiosInstance.delete(`/admin/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message || "Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete package");
    }
  };
const handleToggleExpire = async (id, currentStatus) => {
  try {
    const { data } = await axiosInstance.put(
      `/admin/${id}`,
      {
        isExpired: !currentStatus, // 🔥 toggle value
      },
      { withCredentials: true }
    );

    toast.success(
      !currentStatus ? "Package expired" : "Package activated"
    );

    fetchPackages();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update status");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
       <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
        Admin – Manage Networking Packages
      </h2>

      <div className="max-w-5xl mx-auto overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Price ($)</th>
              <th className="p-3">⭐ Direct Referral Bonus (%)</th>
              <th className="p-3">⚡ Second Referral Bonus(%)</th>
              <th className="p-3">💠 Third Referral Bonus:(%)</th>
              <th className="p-3">Level Reward (%)</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr
                key={pkg._id}
                className="border-b hover:bg-sky-50 transition-colors"
              >
                <td className="p-3">{pkg.name}</td>
           <td className="p-3">
  {editingId === pkg._id ? (
    <input
      name="price"
      value={formData.price}
      onChange={handleChange}
      className="w-20 border rounded p-1 text-center"
    />
  ) : (
    <Price amount={pkg.price || 0} />
  )}
</td>
                {["level1", "level2", "level3"].map((lvl, i) => (
                  <td key={i} className="p-3 text-center">
                    {editingId === pkg._id ? (
                      <input
                        name={lvl}
                        value={formData[lvl]}
                        onChange={handleChange}
                        className="w-16 border rounded p-1 text-center"
                      />
                    ) : (
                      `${pkg.commissions[lvl]}%`
                    )}
                  </td>
                ))}

                <td className="p-3 text-center">
                  {editingId === pkg._id ? (
                    <input
                      name="levelRewardPercent"
                      value={formData.levelRewardPercent}
                      onChange={handleChange}
                      className="w-16 border rounded p-1 text-center"
                    />
                  ) : (
                    `${pkg.levelRewardPercent}%`
                  )}
                </td>

                <td className="p-3 text-center">
  {editingId === pkg._id ? (
    <button
      onClick={() => handleUpdate(pkg._id)}
      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md"
    >
      Save
    </button>
  ) : (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => handleEdit(pkg)}
        className="bg-sky-600 hover:bg-sky-700 text-white py-1 px-3 rounded-md"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(pkg._id)}
        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
      >
        Delete
      </button>
        <button
    onClick={() => handleToggleExpire(pkg._id, pkg.isExpired)}
    className={`py-1 px-3 rounded-md text-white ${
      pkg.isExpired
        ? "bg-green-600 hover:bg-green-700"
        : "bg-yellow-500 hover:bg-yellow-600"
    }`}
  >
    {pkg.isExpired ? "Activate" : "Expire"}
  </button>
    </div>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Packagesadmin;

