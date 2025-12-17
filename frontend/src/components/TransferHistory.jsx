import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import Price from "./Price"; // adjust path if needed
const TransferHistory = () => {
  const { authUser } = useAuthStore();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const fetchTransfers = async () => {
      try {
        const res = await axiosInstance.get("/users/transfer-history", {
          withCredentials: true,
        });
        setTransfers(res.data.transactions || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transfer history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [authUser]);

  if (!authUser)
    return (
      <div className="text-center mt-12">
        Please log in to see your transfer history.
      </div>
    );

  return (
    <div className="min-h-[10vh] bg-gray-50 py-6 px-4 md:px-8">
      <Toaster />
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-sky-800 mb-6 text-center">
        Transfer <span className="text-sky-500">History</span>
      </h2>

      <div className="max-w-6xl mx-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        {/* Scrollable table body */}
        <div className="overflow-y-auto max-h-[400px] overflow-x-auto">
          <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
            <thead className="bg-sky-600 text-white sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left">From</th>
                <th className="px-2 sm:px-4 py-2 text-left">To</th>
                <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
                <th className="px-2 sm:px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No transfers found
                  </td>
                </tr>
              ) : (
                transfers.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b hover:bg-sky-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 py-2">
                      {tx.fromUserId ?? "N/A"} ({tx.fromUsername ?? "N/A"})
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      {tx.toUserId ?? "N/A"} ({tx.toUsername ?? "N/A"})
                    </td>
                    <td className="px-2 sm:px-4 py-2">
  <Price amount={tx.amount ?? 0} />
</td>
                    <td className="px-2 sm:px-4 py-2">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransferHistory;

