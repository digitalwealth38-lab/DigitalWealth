import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    adminNote: "",
    txHash: "",
  });

  // 🧩 Fetch all withdrawals
  const fetchWithdrawals = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/withdrawals", {
        withCredentials: true,
      });

      // ✅ Sort: pending → approved → rejected
      const sorted = data.withdrawals.sort((a, b) => {
        const order = { pending: 1, approved: 2, rejected: 3 };
        return order[a.status] - order[b.status];
      });

      setWithdrawals(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // ✏️ Handle form input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟢 Approve / Reject withdrawal
  const handleUpdate = async (_id) => {
    if (!formData.status) {
      return toast.error("Please select a status (approved/rejected)");
    }

    try {
      const { data } = await axiosInstance.put(
        `/admin/withdrawals/${_id}`,
        formData,
        { withCredentials: true }
      );

      toast.success(data.msg);
      setSelectedId(null);
      fetchWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "Failed to update withdrawal status"
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-sky-600 text-xl font-semibold">
        Loading Withdrawals...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
        💸 Admin – Manage Withdrawals
      </h2>

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* ✅ If no withdrawals */}
        {withdrawals.length === 0 ? (
          <div className="flex justify-center items-center h-[400px] text-gray-500 text-lg font-medium">
            No withdrawal requests yet
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-gray-100">
            <table className="min-w-full">
              <thead className="bg-sky-600 text-white sticky top-0">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Wallet Address</th>
                  <th className="p-3 text-center">Amount ($)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Tx Hash</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w._id}
                    className="border-b hover:bg-sky-50 transition-colors"
                  >
                    <td className="p-3">{w.user?.name || "N/A"}</td>
                    <td className="p-3">{w.user?.email || "N/A"}</td>
                    <td className="p-3 text-gray-800">
                      {w.walletAddress || "-"}
                    </td>
                    <td className="p-3 text-center">${w.amount}</td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        w.status === "approved"
                          ? "text-green-600"
                          : w.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {w.status}
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {w.txHash || "-"}
                    </td>
                    <td className="p-3 text-center">
                      {new Date(w.date).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-center">
                      {selectedId === w._id ? (
                        <div className="space-y-2">
                          <select
                            name="status"
                            onChange={handleChange}
                            value={formData.status}
                            className="border rounded p-1 w-full text-sm"
                          >
                            <option value="">Select status</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                          </select>

                          <input
                            type="text"
                            name="txHash"
                            value={formData.txHash}
                            onChange={handleChange}
                            placeholder="Tx Hash (optional)"
                            className="border rounded p-1 w-full text-sm"
                          />

                          <textarea
                            name="adminNote"
                            value={formData.adminNote}
                            onChange={handleChange}
                            placeholder="Admin note (optional)"
                            className="border rounded p-1 w-full text-sm"
                          />

                          <div className="flex justify-between gap-2">
                            <button
                              onClick={() => handleUpdate(w._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm w-full"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setSelectedId(null)}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm w-full"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedId(w._id);
                            setFormData({
                              status: "",
                              adminNote: w.adminNote || "",
                              txHash: w.txHash || "",
                            });
                          }}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;

