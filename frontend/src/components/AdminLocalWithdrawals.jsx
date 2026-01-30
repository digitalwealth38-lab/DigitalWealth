import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Price from "./Price";
const AdminLocalWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [txHash, setTxHash] = useState("");

  // Fetch all withdrawals
  const fetchWithdrawals = async () => {
    try {
      const res = await axiosInstance.get("/all");
      console.log(res.data)
      setWithdrawals(res.data.withdraws || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load withdrawals");
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Approve withdrawal
  const approveWithdrawal = async () => {
    try {
      await axiosInstance.put(`/${selected._id}`, {
        status: "approved",
        adminNote,
        txHash,
      });
      toast.success("Withdrawal approved");
      setSelected(null);
      setAdminNote("");
      setTxHash("");
      fetchWithdrawals();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to approve");
    }
  };

  // Reject withdrawal
  const rejectWithdrawal = async () => {
    try {
      await axiosInstance.put(`/${selected._id}`, {
        status: "rejected",
        adminNote,
      });
      toast.success("Withdrawal rejected");
      setSelected(null);
      setAdminNote("");
      fetchWithdrawals();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Local Withdrawal Requests</h1>

      {/* Scrollable Table */}
      <div className="overflow-x-auto rounded-xl border shadow-md">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Account Name</th>
                <th className="p-3 text-left">Account Number</th>
                <th className="p-3 text-left">Amount (USD)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr
                  key={w._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{w.user?.name}</td>
                  <td className="p-3">{w.method}</td>
                  <td className="p-3">{w.accountName}</td>
                  <td className="p-3">{w.accountNumber}</td>
                  
                  <td className="p-3"> <Price amount={w.amount} /></td>
                  <td className="p-3 capitalize">{w.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelected(w)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Withdrawal Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><b>User:</b> {selected.user?.name}</p>
              <p><b>Method:</b> {selected.method}</p>
              <p><b>Account Name:</b> {selected.accountName}</p>
              <p><b>Account Number:</b> {selected.accountNumber}</p>
              <p><b>Amount:</b> {selected.amount} USD</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>

       

            {selected.status === "pending" && (
              <>
                   <textarea
              placeholder="Admin Note..."
              className="w-full border p-2 mt-4 rounded-lg"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
                <input
                  type="text"
                  placeholder="Transaction ID / Ref (optional)"
                  className="w-full border p-2 mt-2 rounded-lg"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    onClick={approveWithdrawal}
                  >
                    Approve
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    onClick={rejectWithdrawal}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            {selected.status !== "pending" && (
              <button
                onClick={() => setSelected(null)}
                className="mt-4 bg-gray-700 text-white py-2 w-full rounded-lg hover:bg-gray-800"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocalWithdrawals;
