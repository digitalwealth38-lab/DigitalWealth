import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import { axiosInstance } from "../lib/axios";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TRX");
  const [minAmount, setMinAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minLoading, setMinLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // ✅ Fetch minimum deposit dynamically
  useEffect(() => {
    const fetchMinAmount = async () => {
      try {
        setMinLoading(true);
        setError("");
        const res = await axiosInstance.get(`/user/min-amount/${currency}`);
        setMinAmount(res.data.minAmount);
      } catch (err) {
        console.error("Failed to fetch min amount:", err);
        setError("Unable to fetch minimum deposit amount");
      } finally {
        setMinLoading(false);
      }
    };
    fetchMinAmount();
  }, [currency]);

  // ✅ Fetch deposit history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/users/deposit-history");
        if (res.data.success && res.data.transactions) {
          const formatted = res.data.transactions.map((tx) => ({
            id: tx._id,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            date: tx.date ? new Date(tx.date).toLocaleDateString("en-GB") : "N/A",
            time: tx.date
      ? new Date(tx.date).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) // HH:MM:SS
      : "N/A",
          }));
          console.log(formatted)
          setHistory(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch deposit history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (minAmount && parseFloat(amount) < parseFloat(minAmount)) {
      setError(`Minimum deposit for ${currency} is ${minAmount} USD`);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/deposit", {
        amount: parseFloat(amount),
        currency,
      });

      if (res.data.invoice_url) {
        window.location.href = res.data.invoice_url;
      } else {
        setError("Failed to generate payment link. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Crypto  <span className="text-sky-500">Deposit</span>
      </motion.h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Deposit Form */}
        <motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8"
>
  <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
    Make a Deposit
  </h2>

  <form onSubmit={handleDeposit} className="flex flex-col gap-6">
    {/* Amount Field */}
    <div>
      <label className="text-gray-700 font-semibold mb-2 block">
        Amount (USD)
      </label>
      <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
        <CreditCard className="text-sky-500" size={24} />
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 text-lg"
        />
      </div>

      {/* 🆕 Deposit Fee Info */}
      <p className="text-sm text-sky-600 mt-2">
        ⚠️ A 1.08% deposit fee will be applied.
      </p>

      {minLoading ? (
        <p className="text-sm text-gray-400 mt-2">
          Fetching minimum amount...
        </p>
      ) : minAmount ? (
        <p className="text-sm text-gray-600 mt-2">
          Minimum deposit for {currency}:{" "}
          <b className="text-sky-700">{minAmount} USD</b>
        </p>
      ) : (
        <p className="text-sm text-red-400 mt-2">
          Could not fetch minimum deposit amount.
        </p>
      )}
    </div>

    {/* Currency Selector */}
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-semibold">Currency</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border border-sky-200 rounded-2xl p-3 bg-white/70 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700 transition-all"
      >
        <option value="TRX">TRX</option>
        <option value="USDTTRC20">USDT (TRC20)</option>
      </select>
    </div>

    {/* Submit Button */}
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type="submit"
      disabled={loading}
      className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
    >
      {loading ? "Redirecting to payment..." : "Deposit Now"}
    </motion.button>
  </form>

  {/* Error Message */}
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

        {/* Deposit History */}
   <motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8"
>
  <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
    Deposit History
  </h2>

  {history.length > 0 ? (
    <div className="flex flex-col gap-4 max-h-[18rem] overflow-y-auto pr-2 scroll-smooth">
      {history.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.02 }}
          className="flex justify-between items-center bg-white/70 border border-sky-100 rounded-2xl p-4 shadow-sm"
        >
          <div>
            <p className="text-gray-800 font-semibold">
              {item.amount} USD - {item.currency}
            </p>
            <p className="text-gray-500 text-sm">{"Date:"+item.date}</p>
             <p className="text-gray-500 text-sm">{"Time:"+item.time}</p>
          </div>
          <div className="flex items-center gap-2">
            {item.status === "finished" && (
              <CheckCircle2 className="text-green-500" size={22} />
            )}
            {item.status === "waiting" && (
              <Clock className="text-yellow-500" size={22} />
            )}
            {item.status === "confirming" && (
  <Clock className="text-blue-500" size={22} /> // or any color you prefer
)}
            {item.status === "failed" && (
              <XCircle className="text-red-500" size={22} />
            )}
            <span
              className={`font-medium ${
                item.status === "finished"
                  ? "text-green-600"
                  : item.status === "waiting"
                  ? "text-yellow-600"
                  : item.status === "confirming"
      ? "text-blue-600"
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
    <p className="text-center text-gray-500">No deposits yet.</p>
  )}
</motion.div>

      </div>
    </div>
  );
}
