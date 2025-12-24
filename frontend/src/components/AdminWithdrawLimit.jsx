import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminWithdrawLimit = () => {
  const [limit, setLimit] = useState({
    minAmount: "",
    maxAmount: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // Fetch limit
  const fetchLimit = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/withdraw-limit"
      );
      if (data) {
        setLimit(data);
      }
    } catch (err) {
      toast.error("Failed to load withdraw limit");
    }
  };

  useEffect(() => {
    fetchLimit();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLimit({
      ...limit,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(limit.minAmount) <= 0 || Number(limit.maxAmount) <= 0) {
      return toast.error("Amounts must be greater than 0");
    }

    if (Number(limit.minAmount) >= Number(limit.maxAmount)) {
      return toast.error("Min amount must be less than max amount");
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/admin/withdraw-limit",
        {
          minAmount: Number(limit.minAmount),
          maxAmount: Number(limit.maxAmount),
          isActive: limit.isActive,
        }
      );

      toast.success("Withdraw limit updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center">
        Withdraw Limit Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Minimum Withdraw Amount
          </label>
          <input
            type="number"
            name="minAmount"
            value={limit.minAmount}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Maximum Withdraw Amount
          </label>
          <input
            type="number"
            name="maxAmount"
            value={limit.maxAmount}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="50000"
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            name="isActive"
            checked={limit.isActive}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-gray-700">
            Withdraw Enabled
          </label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
        >
          {loading ? "Saving..." : "Save Withdraw Limit"}
        </button>
      </form>
    </div>
  );
};

export default AdminWithdrawLimit;
