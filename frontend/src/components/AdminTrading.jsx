import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export default function AdminTrading() {
  const [trading, setTrading] = useState({ amount: 0 });
  const [inputAmount, setInputAmount] = useState("");
  const [action, setAction] = useState("add");
  const [loading, setLoading] = useState(false);

  // Fetch current trading deposit
  const fetchTrading = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/admin-trading");
      setTrading(data);
    } catch (err) {
      toast.error("Failed to fetch trading deposit");
    }
  };

  useEffect(() => {
    fetchTrading();
  }, []);

  // Handle add/subtract
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/admin/admin-trading", {
        amount: parseFloat(inputAmount),
        action,
      });
      toast.success(data.message || "Updated successfully!");
      setInputAmount("");
      fetchTrading();
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-sky-700 mb-6">
          Admin Trading Deposit
        </h1>

        {/* Display Current Amount */}
        <div className="text-center mb-6 p-4 rounded-xl font-semibold text-lg bg-sky-50 text-sky-800 border border-sky-200">
          Current Trading Deposit: ${trading.amount}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="border border-sky-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400"
          />

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="border border-sky-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 transition"
          >
            {loading ? "Processing..." : "Update Trading Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
}
