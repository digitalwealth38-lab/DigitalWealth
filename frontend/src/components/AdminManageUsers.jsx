import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Price from "./Price";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchId, setSearchId] = useState("");
  const [searchReferredBy, setSearchReferredBy] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [investments, setInvestments] = useState([]);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [showInvestments, setShowInvestments] = useState(false);

  const [showNetworking, setShowNetworking] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
const [rewardAmount, setRewardAmount] = useState("");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/all", {
        withCredentials: true,
      });
      console.log(data.users)
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  /* ================= OPEN INVESTMENTS MODAL ================= */
  const openInvestments = async (user) => {
    setSelectedUser(user);
    setShowInvestments(true);
    setInvestmentsLoading(true);

    try {
      const { data } = await axiosInstance.get(
        `/admin/user-investments/${user._id}`,
        { withCredentials: true }
      );
      setInvestments(data.investments || []);
    } catch {
      toast.error("Failed to fetch investments");
    }

    setInvestmentsLoading(false);
  };

  const handleBlockUser = async (id) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/block-user/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: data.isBlocked } : u))
      );
    } catch {
      toast.error("Failed");
    }
  };
const handleToggleWithdraw = async (id) => {
  try {
    const { data } = await axiosInstance.patch(
      `/admin/toggle-withdraw/${id}`,
      {},
      { withCredentials: true }
    );

    toast.success(data.message);

    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, canWithdraw: data.canWithdraw } : u
      )
    );
  } catch {
    toast.error("Failed to update withdraw permission");
  }
};
const handleSendReward = async () => {
  if (!rewardAmount || rewardAmount <= 0) {
    toast.error("Enter valid reward amount");
    return;
  }

  try {
    const { data } = await axiosInstance.post(
      `/admin/give-reward/${selectedUser._id}`,
      { amount: Number(rewardAmount) },
      { withCredentials: true }
    );

    toast.success(data.message);

    // update balance instantly
    setUsers(prev =>
      prev.map(u =>
        u._id === selectedUser._id
          ? { ...u, balance: data.balance }
          : u
      )
    );

    setRewardAmount("");
    setShowRewardModal(false);
  } catch {
    toast.error("Failed to send reward");
  }
};

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete user permanently?")) return;
    try {
      await axiosInstance.delete(`/admin/delete-user/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const filteredUsers = users.filter(
  (u) =>
    u.userId.toLowerCase().includes(searchId.toLowerCase()) &&
    (u.referredBy || "").toLowerCase().includes(searchReferredBy.toLowerCase()) &&
    u.email.toLowerCase().includes(searchEmail.toLowerCase())
);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin text-sky-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
     <div className="text-center mb-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 drop-shadow-lg leading-tight md:leading-snug">
    Admin – Manage Users
  </h2>
  <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
    View and manage all your platform users in one place.
  </p>
</div>


      {/* SEARCH */}
     <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4 mb-6">
  <input
    placeholder="Search ID"
    onChange={(e) => setSearchId(e.target.value)}
    className="p-3 border rounded-lg"
  />
  <input
    placeholder="Search Referred By"
    onChange={(e) => setSearchReferredBy(e.target.value)}
    className="p-3 border rounded-lg"
  />
  <input
    placeholder="Search Email"
    onChange={(e) => setSearchEmail(e.target.value)}
    className="p-3 border rounded-lg"
  />
</div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-sky-600 text-white">
            <tr>
             {["ID","Name","Email","Referral","Referred By","Balance","Invested","Earnings","Action"].map(h => (
  <th key={h} className="p-3">{h}</th>
))}

            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user=>(
              <tr key={user._id} className="border-b hover:bg-sky-50">
                <td className="p-2">{user.userId}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.referralCode}</td>
                <td className="p-2">{user.referredBy || "-"}</td>
                <td className="p-2 text-center"><Price amount={user.balance||0}/></td>
                <td className="p-2 text-center"><Price amount={user.investedBalance||0}/></td>
                <td className="p-2 text-center"><Price amount={user.totalEarnings||0}/></td>

                <td className="p-2">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button onClick={()=>openInvestments(user)} className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                      📊 Investments
                    </button>

                    <button onClick={()=>{setSelectedUser(user);setShowNetworking(true)}} className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      🌐 Networking
                    </button>

                    <button onClick={()=>handleBlockUser(user._id)} className={`px-3 py-1.5 rounded-full text-white ${user.isBlocked?"bg-green-600":"bg-yellow-500"}`}>
                      {user.isBlocked?"Unblock":"Block"}
                    </button>
                    <button
  onClick={() => handleToggleWithdraw(user._id)}
  className={`px-3 py-1.5 rounded-full text-white ${
    user.canWithdraw ? "bg-red-600" : "bg-green-600"
  }`}
>
  {user.canWithdraw ? "Disable Withdraw" : "Enable Withdraw"}
</button>
<button
  onClick={() => {
    setSelectedUser(user);
    setShowRewardModal(true);
  }}
  className="px-3 py-1.5 rounded-full bg-emerald-600 text-white"
>
  🎁 Give Reward
</button>

                    <button onClick={()=>handleDeleteUser(user._id)} className="px-3 py-1.5 rounded-full bg-red-600 text-white inline-flex items-center gap-1.5">
                      <Trash2 size={15}/>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INVESTMENTS MODAL */}
      {showInvestments && (
        <Modal title="User Investments" onClose={()=>setShowInvestments(false)} printable>
          <div className="mb-6 border-b pb-4 text-sm print-only">
  <p><b>Member ID:</b> {selectedUser?.userId}</p>
  <p><b>Name:</b> {selectedUser?.name}</p>
  <p><b>Email:</b> {selectedUser?.email}</p>
</div>
          {investmentsLoading ? (
            <Loader className="animate-spin mx-auto"/>
          ) : investments.length === 0 ? (
            <p className="text-center text-gray-500">No investments found</p>
          ) : (
            <div className="overflow-x-auto print:overflow-visible">
              <table className="min-w-full border text-center">
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
                  {investments.map(inv=>(
                    <tr key={inv._id} className="border-b">
                      <td>{inv.packageName}</td>
                      <td><Price amount={inv.investedAmount||0}/></td>
                      <td><Price amount={inv.returnAmount||0}/></td>
                      <td><Price amount={inv.totalProfit||0}/></td>
                      <td><Price amount={inv.totalReturn||0}/></td>
                      <td><Price amount={inv.roiCredited||0}/></td>
                      <td><Price amount={inv.todayProfit||0}/></td>
                      <td className={`font-semibold ${inv.status==="ACTIVE"?"text-green-600":inv.status==="COMPLETED"?"text-blue-600":"text-red-600"}`}>
                        {inv.status}
                      </td>
 <td>{formatDate(inv.startDate)}</td>
<td>{formatDate(inv.expiresAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}

      {/* NETWORKING MODAL */}
      {showNetworking && selectedUser && (
        <Modal title="Networking Details" onClose={()=>setShowNetworking(false)} printable>
          <div className="mb-6 border-b pb-4 text-sm print-only">
  <p><b>Member ID:</b> {selectedUser?.userId}</p>
  <p><b>Name:</b> {selectedUser?.name}</p>
  <p><b>Email:</b> {selectedUser?.email}</p>
</div>
          <div className="grid grid-cols-2 gap-4">
            <Info label="Active Package" value={selectedUser.hasActivePackage?"Yes":"No"} />
            <Info label="Team Size" value={selectedUser.teamSize} />
            <Info label="Direct Referrals" value={selectedUser.directReferrals} />
            <Info label="Level" value={selectedUser.level} />
          </div>
        </Modal>
      )}
      {showRewardModal && selectedUser && (
  <Modal title="Give Admin Reward" onClose={() => setShowRewardModal(false)}>
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-sm text-gray-600">
        <p><b>User ID:</b> {selectedUser.userId}</p>
        <p><b>Name:</b> {selectedUser.name}</p>
      </div>

      <input
        type="number"
        placeholder="Enter reward amount ($)"
        value={rewardAmount}
        onChange={(e) => setRewardAmount(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />

      <button
        onClick={handleSendReward}
        className="w-full bg-emerald-600 text-white py-2 rounded-lg"
      >
        ✅ Send Reward
      </button>
    </div>
  </Modal>
)}
    </div>
  );
};


/* ================= REUSABLE COMPONENTS ================= */

const Modal = ({ title, children, onClose, printable }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-6xl p-6 rounded-xl relative print-area overflow-visible">
      <button onClick={onClose} className="absolute top-4 right-4 no-print">✕</button>

      {printable && (
        <button onClick={()=>window.print()} className="absolute top-4 left-4 bg-sky-600 text-white px-4 py-1.5 rounded-lg no-print">
          ⬇ Download PDF
        </button>
      )}

      <h3 className="text-xl font-bold text-center mb-6">{title}</h3>
      {children}
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <p className="text-gray-500">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

export default AdminManageUsers;
