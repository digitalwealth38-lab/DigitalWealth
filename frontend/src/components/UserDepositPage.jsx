import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CreditCard,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  User2,
  Wallet,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";

export default function UserDepositPage() {
  const [allMethods, setAllMethods] = useState([]);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [history, setHistory] = useState([]);
  const [accountInfo, setAccountInfo] = useState({ method: "", accountName: "", accountNumber: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch methods list (populate select)
  const fetchMethods = async () => {
    try {
      const res = await axiosInstance.get("/payment-methods");
      const list = Array.isArray(res.data) ? res.data : res.data.methods || [];
      setAllMethods(list);

      if (list.length > 0 && !method) setMethod(list[0].method);
    } catch (err) {
      console.error("Failed to fetch payment methods", err);
      toast.error("Failed to load payment methods", { position: "top-center" });
    }
  };

  // Fetch deposit history
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("/user/deposit/my");
      const deposits = (res.data?.deposits || []).map((d) => ({
        id: d._id,
        amount: d.amount,
        adminNote: d.adminNote,
        method: d.method,
        status: d.status,
        date: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-GB") : "N/A",
        time: d.createdAt ? new Date(d.createdAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) : "N/A",
      }));
      setHistory(deposits);
    } catch (err) {
      console.error("Failed to fetch deposit history", err);
      toast.error("Failed to load deposit history", { position: "top-center" });
    }
  };

  // Fetch account details by method name
  const fetchAccountDetails = async (m) => {
    if (!m) {
      setAccountInfo({ method: "", accountName: "", accountNumber: "" });
      return;
    }

    try {
      const res = await axiosInstance.get(`/payment-methods/name/${encodeURIComponent(m)}`);
      const data = res.data;
      setAccountInfo({
        method: data.method || m,
        accountName: data.accountName || "",
        accountNumber: data.accountNumber || "",
      });
    } catch (err) {
      console.error("Failed to load method details", err);
      setAccountInfo({ method: m, accountName: "", accountNumber: "" });
    }
  };

  // Convert file -> base64 screenshot
  const uploadFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit deposit
  const submitDeposit = async () => {
    setError("");
    if (!amount || !screenshot || !method) {
      setError("All fields are required");
      toast.error("All fields are required", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/user/deposit/create", { method, amount, screenshot });
      toast.success("Deposit request submitted!", { position: "top-center" });

      setAmount("");
      setScreenshot("");
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to submit deposit");
      toast.error("Failed to submit deposit", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (method) fetchAccountDetails(method);
  }, [method]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
      >
        Local Bank <span className="text-sky-500">Deposit</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">Submit Deposit Request</h2>

          {/* Deposit Method */}
          <div className="mb-5">
            <label className="text-gray-700 font-semibold">Deposit Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border border-sky-200 rounded-2xl p-3 bg-white/70 outline-none focus:ring-2 focus:ring-sky-400 text-gray-700 w-full"
            >
              {allMethods.length > 0 ? (
                allMethods.map((m) => (
                  <option key={m._id} value={m.method}>
                    {m.method.charAt(0).toUpperCase() + m.method.slice(1)}
                  </option>
                ))
              ) : (
                <option value="">Loading methods...</option>
              )}
            </select>
          </div>

          {/* Account Info */}
          <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl mb-5 shadow-sm">
            <h3 className="text-sky-700 font-semibold mb-3 text-center">Payment Details</h3>
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={20} className="text-sky-600" />
              <span className="text-gray-700 font-medium">Method: {accountInfo.method || "Loading..."}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <User2 size={20} className="text-sky-600" />
              <span className="text-gray-700 font-medium">Name: {accountInfo.accountName || "Loading..."}</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall size={20} className="text-sky-600" />
              <span className="text-gray-700 font-medium">Number: {accountInfo.accountNumber || "Loading..."}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-5">
            <label className="text-gray-700 font-semibold mb-2 block">Amount (PKR)</label>
            <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70">
              <CreditCard className="text-sky-500" size={24} />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 text-lg"
              />
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="mb-5">
            <label className="text-gray-700 font-semibold mb-2 block">Upload Screenshot</label>
            <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 cursor-pointer">
              <Upload size={24} className="text-sky-500" />
              <input type="file" accept="image/*" onChange={uploadFile} />
            </div>
            {screenshot && (
              <img src={screenshot} className="w-40 h-40 mt-3 rounded-xl object-cover shadow-md border mx-auto" alt="Preview" />
            )}
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-center mb-4">
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={submitDeposit}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl w-full shadow-md transition-all"
          >
            {loading ? "Submitting..." : "Submit Deposit"}
          </motion.button>
        </motion.div>

        {/* Deposit History */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">Deposit History</h2>
          {history.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto pr-2">
              {history.map((item) => (
                <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="flex justify-between items-center bg-white/70 border border-sky-100 rounded-2xl p-4 shadow-sm">
                  <div>
                    <p className="text-gray-800 font-semibold">{item.amount} PKR - {item.method}</p>
                    <p className="text-gray-500 text-sm">{"Admin Note: " + item.adminNote}</p>
                    <p className="text-gray-500 text-sm">{"Date: " + item.date}</p>
                    <p className="text-gray-500 text-sm">{"Time: " + item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "pending" && <Clock className="text-yellow-500" size={22} />}
                    {item.status === "approved" && <CheckCircle2 className="text-green-500" size={22} />}
                    {item.status === "rejected" && <XCircle className="text-red-500" size={22} />}
                    <span className={`font-medium ${item.status === "approved" ? "text-green-600" : item.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
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
