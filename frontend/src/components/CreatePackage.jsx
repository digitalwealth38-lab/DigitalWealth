import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminAddInvestPackage = () => {
const [formData, setFormData] = useState({
  name: "",
  investmentAmount: "",
  durationDays: "",
  returnType: "",
  pkgReturn: "", // <-- renamed
  packageExpiresAt: "",
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axiosInstance.post("/admin/investpackage", {
      name: formData.name,
      investmentAmount: Number(formData.investmentAmount),
      durationDays: Number(formData.durationDays),
      pkgReturn: Number(formData.pkgReturn),   // generic return
      returnType: formData.returnType,   // DAILY or WEEKLY
      packageExpiresAt: formData.packageExpiresAt,
    });

    toast.success("✅ Investment package created successfully!");
    setFormData({
      name: "",
      investmentAmount: "",
      durationDays: "",
      returnType: "",
      pkgReturn: "", 
      packageExpiresAt: "",
    });
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to create package");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sky-700 mb-6 text-center">
        ⚙️ Admin – Add Investment Package
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-10 text-center">
        Add New Investment Package
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
              Investment Amount ($)
            </label>
            <input
              type="number"
              name="investmentAmount"
              placeholder="Enter investment amount"
              value={formData.investmentAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Duration (Days)
            </label>
            <input
              type="number"
              name="durationDays"
              placeholder="Enter duration in days"
              value={formData.durationDays}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

<div>
  <label className="block text-gray-600 font-medium mb-2">
    Return Type
  </label>
  <select
    name="returnType"
    value={formData.returnType}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
    required
  >
    <option value="">Select Return Type</option>
    <option value="DAILY">Daily</option>
    <option value="WEEKLY">Weekly</option>
  </select>
</div>

   <div>
  <label className="block text-gray-600 font-medium mb-2">
    Return ($)
  </label>
  <input
  type="number"
  name="pkgReturn"
  value={formData.pkgReturn}
  onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
    required
  />
</div>


          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Package Expiry Date
            </label>
            <input
              type="date"
              name="packageExpiresAt"
              value={formData.packageExpiresAt}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 hover:scale-105"
          >
            Add Investment Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddInvestPackage;
