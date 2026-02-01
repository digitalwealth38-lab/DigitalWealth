import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Banknote,Timer,AlertTriangle,UserCheck, Clock, CheckCircle2, XCircle, Wallet } from "lucide-react";

import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";
export default function LocalWithdrawal() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [methods, setMethods] = useState([]);
    const [limit, setLimit] = useState({
      minAmount: "",
      maxAmount: "",
      isActive: true,
    });
  
console.log(history)
  // Format transactions for display
  const formatTransactions = (transactions) => {
    return transactions.map((tx) => ({
      id: tx._id,
      amount: tx.amount,
      method: tx.method,
      accountName: tx.accountName,
      accountNumber: tx.accountNumber,
      adminNote: tx.adminNote,
      status: tx.status,
      date: formatDateTime(tx.createdAt),
    }));
  };

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
  // Fetch withdrawal methods (JazzCash, EasyPaisa, etc.)
  const fetchMethods = async () => {
    try {
      const res = await axiosInstance.get("/payment-methods"); // same as deposit fetch
      setMethods(res.data);
    } catch (err) {
      console.error("Failed to fetch methods:", err);
    }
  };

  // Fetch user withdrawal history
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("/history");
      
      if (res.data.transactions) {
        setHistory(formatTransactions(res.data.transactions
));

      }
    } catch (err) {
      console.error("Failed to fetch withdraw history:", err);
    }
  };

  useEffect(() => {
    fetchMethods();
    fetchHistory();
  }, []);

  // Handle withdrawal submission
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      setError("Enter a valid amount");
      return;
    }
    if (!method) {
      toast.error("Select a withdrawal method");
      setError("Select a withdrawal method");
      return;
    }
    if (!accountName || !accountNumber) {
      toast.error("Enter account name and number");
      setError("Enter account name and number");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/withdraw/create", {
        amount: parseFloat(amount),
        method,
        accountName,
        accountNumber,
      });

      if (res.data.withdraw) {
        toast.success("✅ Withdrawal request submitted successfully!");
        setAmount("");
        setMethod("");
        setAccountName("");
        setAccountNumber("");
        fetchHistory();
      } else {
        toast.error(res.data.message || "Failed to submit withdrawal request");
        setError(res.data.message || "Failed to submit withdrawal request");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Local  <span className="text-sky-500">Withdraw</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Withdrawal History */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
            Withdrawal History
          </h2>

          {history.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[18rem] overflow-y-auto pr-2">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-white/70 border border-sky-100 rounded-2xl p-4 shadow-sm"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {item.amount} USD - {item.method}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Account Name: {item.accountName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Account Number: {item.accountNumber}
                    </p>
                    <p className="text-gray-500 text-sm">Admin Note: {item.adminNote}</p>
                    <p className="text-gray-500 text-sm">Date: {item.date}</p>
                    <p className="text-gray-500 text-sm">Time: {item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "approved" && (
                      <CheckCircle2 className="text-green-500" size={22} />
                    )}
                    {item.status === "pending" && (
                      <Clock className="text-yellow-500" size={22} />
                    )}
                    {item.status === "rejected" && (
                      <XCircle className="text-red-500" size={22} />
                    )}
                    <span
                      className={`font-medium ${
                        item.status === "approved"
                          ? "text-green-600"
                          : item.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No withdrawals yet.</p>
          )}
        </motion.div>

        {/* Withdrawal Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
            Request Withdrawal
          </h2>

          <form onSubmit={handleWithdraw} className="flex flex-col gap-6">
            {/* Amount */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Amount (USD)
              </label>
              <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 focus-within:ring-2 focus-within:ring-sky-400">
                <Banknote className="text-sky-500" size={24} />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 text-lg"
                />
              </div>
            </div>

            {/* Method Selector */}
            <div>
              <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-200 p-5 rounded-2xl mb-5 shadow-sm">
  <h3 className="text-sky-700 font-semibold mb-4 text-center text-lg">
   Withdrawal Details
  </h3>
{limit && (
  <div
    className={`mb-6 p-4 rounded-2xl border text-center ${
      limit.isActive
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200"
    }`}
  >
    <p
      className={`font-semibold ${
        limit.isActive ? "text-green-700" : "text-red-700"
      }`}
    >
      {limit.isActive
        ? "Withdrawals are currently ACTIVE"
        : "Withdrawals are currently DISABLED"}
    </p>

    {limit.isActive && (
      <p className="text-gray-700 mt-2 text-sm">
        Minimum Withdraw:{" "}
        <span className="font-bold text-gray-900">
          ${limit.minAmount}
        </span>{" "}
        | Maximum Withdraw:{" "}
        <span className="font-bold text-gray-900">
          ${limit.maxAmount}
        </span>
      </p>
    )}
  </div>
)}

  <div className="space-y-3 text-gray-700">
    <div className="flex items-start gap-3">
      <Clock size={20} className="text-sky-600 mt-0.5" />
      <span className="font-medium">
        Processing Hours:
        <span className="block text-sm text-gray-600">
          9:00 AM – 5:00 PM (Monday to Friday)
        </span>
      </span>
    </div>

    <div className="flex items-start gap-3">
      <Timer size={20} className="text-sky-600 mt-0.5" />
      <span className="font-medium">
        Maximum Processing Time:
        <span className="block text-sm text-gray-600">
          24 hours
        </span>
      </span>
    </div>

    <div className="flex items-start gap-3">
      <AlertTriangle size={20} className="text-sky-600 mt-0.5" />
      <span className="font-medium">
        Note:
        <span className="block text-sm text-gray-600">
          If the selected bank's link is down or under maintenance, processing may take up to 7 business days.
        </span>
      </span>
    </div>

    <div className="flex items-start gap-3">
      <UserCheck size={20} className="text-sky-600 mt-0.5" />
      <span className="font-medium">
        Eligibility:
        <span className="block text-sm text-gray-600">
          You must have at least 1 active member to be eligible for withdrawal. Adding 1 member is mandatory.
        </span>
      </span>
    </div>
  </div>

  <div className="mt-4 text-center text-xs text-gray-500">
    Please ensure you meet all requirements before initiating a withdrawal.
  </div>
</div>

              <label className="text-gray-700 font-semibold mb-2 block">
                Select Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border border-sky-200 rounded-2xl p-3 bg-white/70 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700 w-full"
              >
                <option value="">Select Method</option>
                {methods.map((m) => (
                  <option key={m._id} value={m.method}>
                    {m.method}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Name */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Account Name
              </label>
              <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 focus-within:ring-2 focus-within:ring-sky-400">
                <Wallet className="text-sky-500" size={24} />
                <input
                  type="text"
                  placeholder="Enter account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 text-lg"
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Account Number
              </label>
              <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 focus-within:ring-2 focus-within:ring-sky-400">
                <Wallet className="text-sky-500" size={24} />
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 text-lg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
            >
              {loading ? "Processing..." : "Withdraw Now"}
            </motion.button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
