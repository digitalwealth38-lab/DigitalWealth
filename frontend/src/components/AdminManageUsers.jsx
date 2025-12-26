import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Price from "./Price";
import avatarpng from "../assets/avatar.png";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [investments, setInvestments] = useState({});
  const [investmentsLoading, setInvestmentsLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/users/all", {
        withCredentials: true,
      });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  /* ================= FETCH USER INVESTMENTS ================= */
  const fetchUserInvestments = async (userId) => {
    if (investments[userId]) return;

    setInvestmentsLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/admin/user-investments/${userId}`,
        { withCredentials: true }
      );

      setInvestments((prev) => ({
        ...prev,
        [userId]: data.investments || [],
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch investments");
    }
    setInvestmentsLoading(false);
  };
const handleBlockUser = async (userId) => {
  try {
    const { data } = await axiosInstance.patch(
      `/admin/block-user/${userId}`,
      {},
      { withCredentials: true }
    );

    toast.success(data.message);

    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isBlocked: data.isBlocked } : u
      )
    );
  } catch (error) {
    console.error(error);
    toast.error("Failed to update user status");
  }
};

  /* ================= DELETE USER ================= */
  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm(
      "Are you sure? This user and ALL related data will be deleted permanently."
    );

    if (!confirm) return;

    try {
      await axiosInstance.delete(`/admin/delete-user/${userId}`, {
        withCredentials: true,
      });

      toast.success("User deleted successfully");

      // Remove user from UI
      setUsers((prev) => prev.filter((u) => u._id !== userId));

      // Cleanup expanded & investments state
      if (expandedUserId === userId) setExpandedUserId(null);

      setInvestments((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTER USERS ================= */
  const filteredUsers = users.filter(
    (user) =>
      user.userId.toLowerCase().includes(searchId.toLowerCase()) &&
      user.name.toLowerCase().includes(searchName.toLowerCase()) &&
      user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-sky-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">
        Admin – Manage Users
      </h2>

      {/* SEARCH */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* USERS TABLE */}
      <div
        className="max-w-7xl mx-auto overflow-auto rounded-xl shadow-lg border border-gray-200"
        style={{ maxHeight: "70vh" }}
      >
        <table className="min-w-full bg-white">
          <thead className="bg-sky-600 text-white sticky top-0">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Referral Code</th>
              <th className="p-3">Referred By</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Invested</th>
              <th className="p-3">Total Earnings</th>
              <th className="p-3">Active Package</th>
              <th className="p-3">Team Size</th>
              <th className="p-3">Direct Referrals</th>
              <th className="p-3">Level</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isExpanded = expandedUserId === user._id;

                return (
                  <React.Fragment key={user._id}>
                    <tr className="border-b hover:bg-sky-50">
                      <td className="p-2">{user.userId}</td>
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.referralCode}</td>
                      <td className="p-2">{user.referredBy}</td>
                      <td className="p-2 text-center">
                        <Price amount={user.balance || 0} />
                      </td>
                      <td className="p-2 text-center">
                        <Price amount={user.investedBalance || 0} />
                      </td>
                      <td className="p-2 text-center">
                        <Price amount={user.totalEarnings || 0} />
                      </td>
                      <td className="p-2 text-center">
                        {user.hasActivePackage ? "Yes" : "No"}
                      </td>
                      <td className="p-2">{user.teamSize}</td>
                      <td className="p-2">{user.directReferrals}</td>
                      <td className="p-2">{user.level}</td>

                      {/* ACTIONS */}
   <td className="p-2 text-center">
  <div className="flex justify-center items-center gap-2">

    {/* INVESTMENTS */}
    <button
      className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded whitespace-nowrap"
      onClick={() => {
        if (isExpanded) {
          setExpandedUserId(null);
        } else {
          setExpandedUserId(user._id);
          fetchUserInvestments(user._id);
        }
      }}
    >
      Investments
    </button>

    {/* BLOCK / UNBLOCK */}
    <button
      onClick={() => handleBlockUser(user._id)}
      className={`px-3 py-1 rounded text-white whitespace-nowrap transition ${
        user.isBlocked
          ? "bg-green-600 hover:bg-green-700"
          : "bg-yellow-600 hover:bg-yellow-700"
      }`}
    >
      {user.isBlocked ? "Unblock" : "Block"}
    </button>

    {/* DELETE */}
    <button
      onClick={() => handleDeleteUser(user._id)}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded inline-flex items-center gap-1 whitespace-nowrap"
    >
      <Trash2 size={16} />
      Delete
    </button>

  </div>
</td>


                    </tr>

                    {/* EXPANDED INVESTMENTS */}
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={13} className="p-3">
                          {investmentsLoading ? (
                            <div className="flex justify-center py-6">
                              <Loader className="w-8 h-8 animate-spin text-sky-600" />
                            </div>
                          ) : !investments[user._id] ||
                            investments[user._id].length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                              No investments found
                            </div>
                          ) : (
                            <div className="overflow-auto">
                              <table className="min-w-full bg-white shadow rounded-lg text-center">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th>Package</th>
                                    <th>Invested</th>
                                    <th>Return</th>
                                    <th>Total Profit</th>
                                    <th>Total Return</th>
                                    <th>ROI Credited</th>
                                    <th>Today Profit</th>
                                    <th>Status</th>
                                    <th>Start</th>
                                    <th>Expiry</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {investments[user._id].map((inv) => (
                                    <tr key={inv._id} className="border-b">
                                     <td>{inv.packageName}</td>
                                      <td>
                                        <Price amount={inv.investedAmount|| 0} />
      
                                        </td>
                                      <td>
                                        <Price amount={inv.returnAmount || 0} />
                                      
                                        </td>
                                      <td>
                                        <Price amount={inv.totalProfit || 0} />
                                        
                                        </td>
                                      <td>
                                        <Price amount={inv.totalReturn || 0} />
                                     
                                        </td>
                                      <td>
                                        <Price amount={inv.roiCredited || 0} />
                                       
                                        </td>
                                      <td>
                                        <Price amount={inv.todayProfit || 0} />
                                        
                                        </td>
                                      <td
                                        className={`font-semibold ${
                                          inv.status === "ACTIVE"
                                            ? "text-green-600"
                                            : inv.status === "COMPLETED"
                                            ? "text-blue-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {inv.status}
                                      </td>
                                      <td>
                                        {new Date(
                                          inv.startDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td>
                                        {new Date(
                                          inv.expiresAt
                                        ).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageUsers;
