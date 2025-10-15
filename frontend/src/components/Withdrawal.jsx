import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Banknote, Clock, CheckCircle2, XCircle, Wallet } from "lucide-react";
import { axiosInstance } from "../lib/axios";

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TRX");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
console.log(walletAddress)
  // ✅ Fetch withdrawal history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/withdrawals/history");
        if (res.data.success && res.data.transactions) {
          const formatted = res.data.transactions.map((tx) => ({
            id: tx._id,
            amount: tx.amount,
            currency: tx.currency,
            address: tx.walletAddress || "N/A",
            status: tx.status,
            date: tx.date ? new Date(tx.date).toLocaleDateString("en-GB") : "N/A",
            time: tx.date
              ? new Date(tx.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "N/A",
          }));
          setHistory(formatted);
        }
      } catch (err) {
        console.error("❌ Failed to fetch withdraw history:", err);
      }
    };
    fetchHistory();
  }, []);

  // ✅ Handle withdrawal request
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedAddress = walletAddress.trim();
    const trimmedAmount = amount.trim();

    // Frontend validations
    if (!trimmedAmount || isNaN(trimmedAmount) || parseFloat(trimmedAmount) <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }
    if (!trimmedAddress) {
      setError("Please enter your wallet address.");
      return;
    }
    if (!currency) {
      setError("Please select a currency.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/withdrawals", {
        amount: parseFloat(trimmedAmount),
        currency,
        walletAddress: trimmedAddress,
      });

      if (res.data.success) {
        alert("✅ Withdrawal request submitted successfully! Admin will review soon.");
        setAmount("");
        setWalletAddress("");
        // refresh history
        const updated = await axiosInstance.get("/withdrawals/history");
        setHistory(updated.data.transactions || []);
      } else {
        setError(res.data.msg || "Failed to submit withdrawal request.");
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Withdraw <span className="text-sky-500">Funds</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* ✅ Withdrawal History */}
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
                      {item.amount} USD - {item.currency}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Address: {item.address}
                    </p>
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

        {/* ✅ Withdrawal Form */}
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

            {/* Wallet Address */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Wallet Address
              </label>
              <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 focus-within:ring-2 focus-within:ring-sky-400">
                <Wallet className="text-sky-500" size={24} />
                <input
                  type="text"
                  placeholder="Enter your TRX / USDT wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 text-lg"
                />
              </div>
            </div>

            {/* Currency Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-semibold">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-sky-200 rounded-2xl p-3 bg-white/70 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
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

