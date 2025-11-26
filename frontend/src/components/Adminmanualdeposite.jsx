import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminManualDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [selected, setSelected] = useState(null);
  const [priceAmount, setPriceAmount] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [amount, setAmount] = useState("");

  const [showFullImage, setShowFullImage] = useState(false);

  const fetchDeposits = async () => {
    try {
      const res = await axiosInstance.get("/admin/deposits");
      setDeposits(res.data);
    } catch (err) {
      toast.error("Failed to load deposits");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const approveDeposit = async () => {
    if (!priceAmount) return toast.error("Enter price amount (USD)");

    try {
      await axiosInstance.put(`/admin/deposits/${selected._id}`, {
        status: "approved",
        adminNote,
        price_amount: priceAmount,
        amount,
      });

      toast.success("Deposit Approved");
      setSelected(null);
      setPriceAmount("");
      setAdminNote("");
      fetchDeposits();
    } catch (err) {
      toast.error("Approval failed");
      console.error(err);
    }
  };

  const rejectDeposit = async () => {
    try {
      await axiosInstance.put(`/admin/deposits/${selected._id}`, {
        status: "rejected",
        adminNote,
      });

      toast.success("Deposit rejected");
      setSelected(null);
      setAdminNote("");
      fetchDeposits();
    } catch (err) {
      toast.error("Failed");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manual Deposit Requests</h1>

      {/* SCROLLABLE WRAPPER */}
      <div className="overflow-x-auto rounded-xl border shadow-md">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Amount (PKR)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {deposits.map((d) => (
                <tr
                  key={d._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{d.user?.name}</td>
                  <td className="p-3">{d.user?.email}</td>
                  <td className="p-3">{d.method}</td>
                  <td className="p-3">{d.amount}</td>
                  <td className="p-3 capitalize">{d.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelected(d)}
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

      {/* --- VIEW MODAL --- */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Deposit Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* INFO */}
            <div className="space-y-2 text-sm">
              <p><b>User:</b> {selected.user?.name}</p>
              <p><b>Email:</b> {selected.user?.email}</p>
              <p><b>Method:</b> {selected.method}</p>
              <p><b>Amount:</b> {selected.amount} PKR</p>
            </div>

            {/* Screenshot Preview */}
            <div className="mt-4">
              <p className="font-medium mb-1">Screenshot:</p>
              <img
                src={selected.screenshot}
                alt="Deposit Proof"
                className="w-40 h-40 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                onClick={() => setShowFullImage(true)}
              />
            </div>

            {/* Enlarged Image */}
            {showFullImage && (
              <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                onClick={() => setShowFullImage(false)}
              >
                <img
                  src={selected.screenshot}
                  className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
                />
              </div>
            )}

            {/* Admin Note */}
          

            {/* Approve / Reject */}
            {selected.status === "pending" && (
              <>
                <textarea
              placeholder="Admin Note..."
              className="w-full border p-2 mt-4 rounded-lg"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
              <input
  type="number"
  placeholder="Correct Amount (PKR)"
  className="w-full border p-2 mt-2 rounded-lg"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>
                <input
                  type="number"
                  placeholder="Price Amount (USD)"
                  className="w-full border p-2 mt-2 rounded-lg"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    onClick={approveDeposit}
                  >
                    Approve
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    onClick={rejectDeposit}
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

export default AdminManualDeposits;

