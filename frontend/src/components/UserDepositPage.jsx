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
  CheckCircle,
  QrCode,
  X,
  Eye
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
  const [showQR, setShowQR] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
const [showDepositImage, setShowDepositImage] = useState(false);

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
      console.log(res)
      const deposits = (res.data?.deposits || []).map((d) => ({
        id: d._id,
        amount: d.amount,
        adminNote: d.adminNote,
        method: d.method,
        status: d.status,
        screenshot:d.screenshot,
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
        qrCode: data.qrCode || "",
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
      <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl mb-5 shadow-sm overflow-hidden">
  
  {/* Header */}
  <div className="bg-sky-600 px-5 py-3 flex justify-between items-center">
    <h3 className="text-white font-bold text-sm tracking-wide uppercase">Payment Details</h3>
    {accountInfo.qrCode && (
      <button
        onClick={() => setShowQR(true)}
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
      >
        <QrCode size={14} /> Scan QR
      </button>
    )}
  </div>

  {/* Details */}
  <div className="p-5 space-y-3">
    <div className="flex items-center gap-3 bg-white border border-sky-100 rounded-xl px-4 py-3 shadow-sm">
      <Wallet size={18} className="text-sky-500 shrink-0" />
      <div>
        <p className="text-xs text-gray-400 font-medium">Method</p>
        <p className="text-gray-800 font-semibold text-sm">{accountInfo.method || "—"}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 bg-white border border-sky-100 rounded-xl px-4 py-3 shadow-sm">
      <User2 size={18} className="text-sky-500 shrink-0" />
      <div>
        <p className="text-xs text-gray-400 font-medium">Account Name</p>
        <p className="text-gray-800 font-semibold text-sm">{accountInfo.accountName || "—"}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 bg-white border border-sky-100 rounded-xl px-4 py-3 shadow-sm">
      <PhoneCall size={18} className="text-sky-500 shrink-0" />
      <div>
        <p className="text-xs text-gray-400 font-medium">Account Number</p>
        <p className="text-gray-800 font-semibold text-sm">{accountInfo.accountNumber || "—"}</p>
      </div>
    </div>
  </div>
</div>

{/* QR Modal */}
{showQR && accountInfo.qrCode && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    style={{ zIndex: 9999 }}
    onClick={() => setShowQR(false)}
  >
    <div
      className="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
      style={{ zIndex: 10000 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sky-700 text-lg">Scan to Pay</h3>
        <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-4">
        <img
          src={accountInfo.qrCode}
          alt="QR Code"
          className="w-48 h-48 object-contain mx-auto rounded-lg"
        />
      </div>

      <p className="text-sm text-gray-500 mb-1">
        <span className="font-semibold text-gray-700">{accountInfo.method}</span>
      </p>
      <p className="text-sm text-gray-500 mb-1">{accountInfo.accountName}</p>
      <p className="text-sm font-bold text-sky-700">{accountInfo.accountNumber}</p>

      <button
        onClick={() => setShowQR(false)}
        className="mt-5 w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl font-semibold transition text-sm"
      >
        Close
      </button>
    </div>
  </div>
)}

       <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-200 p-5 rounded-2xl mb-5 shadow-sm">
  <h3 className="text-sky-700 font-semibold mb-4 text-center text-lg">
    Deposit Processing Time
  </h3>

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
      <CheckCircle size={20} className="text-sky-600 mt-0.5" />
      <span className="font-medium">
        Deposit Approval:
        <span className="block text-sm text-gray-600">
          Deposits are approved during official bank working hours only.
        </span>
      </span>
    </div>
  </div>

  <div className="mt-4 text-center text-xs text-gray-500">
    Please allow some time for verification outside working hours.
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
  <label className="text-gray-700 font-semibold mb-2 block">
    Upload Screenshot
  </label>

  <div className="flex items-center gap-3 border border-sky-200 rounded-2xl p-3 bg-white/70 cursor-pointer overflow-hidden">
    <Upload size={24} className="text-sky-500 shrink-0" />

    <input
      type="file"
      accept="image/*"
      onChange={uploadFile}
      className="w-full text-sm file:mr-3 file:py-1.5 file:px-3
                 file:rounded-lg file:border-0
                 file:bg-sky-100 file:text-sky-700
                 hover:file:bg-sky-200"
    />
  </div>

  {screenshot && (
    <img
      src={screenshot}
      className="w-40 h-40 mt-3 rounded-xl object-cover shadow-md border mx-auto"
      alt="Preview"
    />
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
      {/* Deposit History */}
<motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
  className="backdrop-blur-lg bg-white/70 border border-sky-100 shadow-2xl rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">Deposit History</h2>

  {history.length > 0 ? (
    <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto pr-2">
      {history.map((item) => (
        <motion.div key={item.id} whileHover={{ scale: 1.02 }}
          className="flex justify-between items-center bg-white/70 border border-sky-100 rounded-2xl p-4 shadow-sm">
          <div>
            <p className="text-gray-800 font-semibold">{item.amount} PKR - {item.method}</p>
            <p className="text-gray-500 text-sm">Date: {item.date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {item.status === "approved" && <CheckCircle2 className="text-green-500" size={22} />}
              {item.status === "pending"  && <Clock className="text-yellow-500" size={22} />}
              {item.status === "rejected" && <XCircle className="text-red-500" size={22} />}
              <span className={`font-medium text-sm ${
                item.status === "approved" ? "text-green-600" :
                item.status === "pending"  ? "text-yellow-600" : "text-red-600"
              }`}>
                {item.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedDeposit(item)}
              className="flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-sky-200 transition"
            >
              <Eye size={15} /> View
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">No deposits yet.</p>
  )}

  {/* Detail Modal */}
  {selectedDeposit && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl overflow-y-auto p-5"
        style={{ zIndex: 10000, maxWidth: '420px', width: '100%', maxHeight: '85vh', margin: '0 16px' }}>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-sky-800">Deposit Details</h2>
          <button onClick={() => setSelectedDeposit(null)} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          {[
            ["Amount",    `${selectedDeposit.amount} PKR`],
            ["Method",    selectedDeposit.method],
            ["Date",      selectedDeposit.date],
            ["Time",      selectedDeposit.time],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b pb-1.5">
              <span className="font-semibold text-gray-600">{label}</span>
              <span className="text-right max-w-[60%]">{value}</span>
            </div>
          ))}

          {selectedDeposit.adminNote && (
            <div className="flex justify-between border-b pb-1.5">
              <span className="font-semibold text-gray-600">Admin Note</span>
              <span className="text-right max-w-[60%]">{selectedDeposit.adminNote}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="font-semibold text-gray-600">Status</span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${
              selectedDeposit.status === "approved" ? "bg-green-100 text-green-700" :
              selectedDeposit.status === "pending"  ? "bg-yellow-100 text-yellow-700" :
                                                      "bg-red-100 text-red-700"
            }`}>
              {selectedDeposit.status}
            </span>
          </div>
        </div>

        {selectedDeposit.screenshot && (
          <div className="mt-4">
            <p className="font-semibold text-sm text-gray-700 mb-2">Screenshot</p>
            <img src={selectedDeposit.screenshot} alt="Deposit proof"
              className="w-28 h-28 object-cover rounded-xl border cursor-pointer hover:opacity-80 transition"
              onClick={() => setShowDepositImage(true)} />
          </div>
        )}

        <button onClick={() => setSelectedDeposit(null)}
          className="mt-4 w-full bg-sky-600 text-white py-2 rounded-xl font-semibold hover:bg-sky-700 transition text-sm">
          Close
        </button>
      </motion.div>
    </div>
  )}

  {/* Enlarged Screenshot */}
  {showDepositImage && selectedDeposit?.screenshot && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center cursor-zoom-out"
      style={{ zIndex: 10001 }} onClick={() => setShowDepositImage(false)}>
      <img src={selectedDeposit.screenshot} className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl" />
    </div>
  )}
</motion.div>
      </div>
    </div>
  );
}
