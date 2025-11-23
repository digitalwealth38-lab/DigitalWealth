import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import avatarpng from "../assets/avatar.png";
const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/users/all", { withCredentials: true });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user._id.toLowerCase().includes(searchId.toLowerCase()) &&
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
      <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Admin – Manage Users</h2>

      {/* Search Bars */}
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

      {/* Table Container */}
      <div className="max-w-7xl mx-auto overflow-auto rounded-xl shadow-lg border border-gray-200" style={{ maxHeight: "70vh" }}>
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
              <th className="p-3">Has Active Package</th>
              <th className="p-3">Team Size</th>
              <th className="p-3">Direct Referrals</th>
              <th className="p-3">Level</th>
              <th className="p-3">Profile Pic</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center p-6 text-gray-500">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b hover:bg-sky-50 transition-colors">
                  <td className="p-2 ">{user.userId}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 ">{user.email}</td>
                  <td className="p-2 ">
                    {user.referralCode}
                  </td>
                  <td className="p-2">{user.referredBy || "-"}</td>
                  <td className="p-2 text-center">${ (user.balance || 0).toFixed(2) }</td>
                  <td className="p-2 text-center"> ${ (user.investedBalance || 0).toFixed(2) }</td>
                  <td className="p-2 text-center">${user.totalEarnings || 0}</td>
                  <td className="p-2 text-center">{user.hasActivePackage ? "✅ Yes" : "❌ No"}</td>
                  <td className="p-2 text-center">{user.teamSize || 0}</td>
                  <td className="p-2 text-center">{user.directReferrals || 0}</td>
                  <td className="p-2 text-center">{user.level || 0}</td>
                 <td className="p-2">
  <img
    src={user.profilePic || avatarpng } // fallback to default avatar
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover mx-auto"
  />
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageUsers;

