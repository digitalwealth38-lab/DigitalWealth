import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

const TransferUsers = () => {
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");

  const [loadingTransfer, setLoadingTransfer] = useState(false); // New loading state

  if (!authUser) return <div className="text-center mt-20">Please log in to access this page.</div>;

  // Search users
  const handleSearch = async () => {
    if (!searchId.trim() && !searchName.trim() && !searchEmail.trim()) {
      return toast.error("Enter at least one field to search");
    }

    setLoading(true);
    try {
      const params = { id: searchId, name: searchName, email: searchEmail };
      const res = await axiosInstance.get("/users/search", { params, withCredentials: true });
      setUsers(res.data.users.filter(u => u._id !== authUser._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user");
    }
    setLoading(false);
  };

  // Open transfer modal
  const openModal = (user) => {
    setSelectedUser(user);
    setAmount("");
    setModalOpen(true);
  };

  // Transfer money
  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return toast.error("Invalid amount");
    }

    setLoadingTransfer(true); // start spinner

    try {
      await axiosInstance.post(
        "/users/transfer",
        { fromUserId: authUser._id, toUserId: selectedUser._id, amount: parseFloat(amount) },
        { withCredentials: true }
      );
      toast.success(`Transferred $${amount} to ${selectedUser.name}`);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Transfer failed");
    }

    setLoadingTransfer(false); // stop spinner
  };

  return (
    <div className="min-h-[10vh] bg-gray-50 py-12 px-4">
      <Toaster />
      <h2 className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center">
        Transfer <span className="text-sky-500">Money</span>
      </h2>

      {/* Search inputs */}
      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <input
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 w-full"
        />
        <input
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 w-full"
        />
        <input
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 w-full"
        />
        <button
          onClick={handleSearch}
className="px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition w-full"
        >
          Search
        </button>
      </div>

      {/* Users Table */}
{/* Users Table */}
<div className="max-w-6xl mx-auto rounded-xl shadow-lg border border-gray-200">
  <div className="overflow-x-auto max-h-64 overflow-y-auto">  
    <table className="min-w-full table-auto bg-white">
      <thead className="bg-sky-600 text-white">
        <tr>
          <th className="px-4 py-3 text-left">ID</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-center">Transfer</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center p-6">Loading...</td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center p-6 text-gray-500">No users found</td>
          </tr>
        ) : (
          users.map(user => (
            <tr key={user._id} className="border-b hover:bg-sky-50 transition-colors">
              <td className="px-4 py-3">{user.userId}</td>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <button
                  className="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                  onClick={() => openModal(user)}
                >
                  Transfer
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>



      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred Background */}
          <div className="absolute inset-0 backdrop-blur-sm bg-gray-100/30 transition-opacity"></div>

          {/* Modal Content */}
          <div className="relative bg-sky-100 rounded-2xl shadow-2xl p-6 w-80 sm:w-96 animate-scale-up border border-sky-300">
            <h3 className="text-2xl font-bold mb-4 text-center text-sky-700">
              Transfer to {selectedUser.name}
            </h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-sky-300 rounded-lg mb-4 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={loadingTransfer} // disable cancel while loading
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  loadingTransfer ? "bg-sky-300 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"
                }`}
                disabled={loadingTransfer} // disable OK while loading
              >
                {loadingTransfer ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferUsers;
