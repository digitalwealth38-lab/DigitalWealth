import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import Price from "./Price"; // make sure the path is correct
import { axiosInstance } from "../lib/axios";
import {
  Users,
  DollarSign,
  Briefcase,
Share2,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  AlertCircle,
  TrendingUp,
  Activity,
  CreditCard ,
  Bitcoin, 
  Edit
} from "lucide-react";
import CurrencyToggle from "./CurrencyToggle";
import Modal from "./Modal"; // New
import RecentActivities from "./RecentActivities"; // New
import AdminTrading from "./AdminTrading";
import AdminAddPackage from "./AdminAddPackage";
import AdminAddInvestPackage from "./CreatePackage";
import AdminWithdrawLimit from "./AdminWithdrawLimit";
import AdminPaymentMethods from "./AdminPaymentMethods";
import EditPackage from "./EditPackage";
import Packagesadmin from "./Packagesadmin";
import AdminWithdrawals from "./AdminWithdrawals";
import AdminLocalWithdrawals from "./AdminLocalWithdrawals";
import AdminManualDeposits from "./Adminmanualdeposite";

export default function DashboardAdminCard() {
  const [stats, setStats] = useState(null);
  const [wave, setWave] = useState(false);

  // New state for Recent Activities modal
  const [openActivities, setOpenActivities] = useState(false);
const [openTrading, setOpenTrading] = useState(false);
const [openNetworkPackage, setOpenNetworkPackage] = useState(false);
const [openInvestmentPackage, setOpenInvestmentPackage] = useState(false);
const [openWithdrawalLimit, setOpenWithdrawalLimit] = useState(false);
const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
const [openEditNetwork, setOpenEditNetwork] = useState(false);
const [openEditInvestment, setOpenEditInvestment] = useState(false);
const [openCryptoWithdraw, setOpenCryptoWithdraw] = useState(false);
const [openLocalWithdraw, setOpenLocalWithdraw] = useState(false);
const [openLocalDeposit, setOpenLocalDeposit] = useState(false);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats", { withCredentials: true });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWave((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  const cards = [
    {
      icon: Briefcase,
      title: "Total Invested",
      value: <Price amount={stats.totalInvestedBalance || 0} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: DollarSign,
      title: "Admin Profit",
      value: <Price amount={stats.adminProfit || 0} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Wallet,
      title: "Platform Balance",
      value: <Price amount={stats.platformBalance || 0} />,
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    {
      icon: ArrowDownCircle,
      title: "Total Deposits",
      value: <Price amount={stats.finalDeposits || 0} />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      icon: ArrowUpCircle,
      title: "Total Withdrawals",
      value: <Price amount={stats.finalWithdrawal || 0} />,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
      {
      icon: Users,
      title: "Total Users",
      value: stats.totalUsers || 0, // not money, leave as is
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: TrendingUp,
      title: "Trading Deposit",
      value: <Price amount={stats.tradingDeposit || 0} />,
      color: "text-green-600",
      bg: "bg-green-100",
      clickable: true, 
    },
    // 🔹 New Recent Activities Card
    {
      icon: Activity,
      title: "Recent Activities",
      value: "View Logs",
      color: "text-purple-600",
      bg: "bg-purple-100",
      clickable: true,
    },
    {
  icon: Share2, // any icon you want
  title: "Create Network Package",
  value: "Add Package",
  color: "text-pink-600",
  bg: "bg-pink-100",
  clickable: true,
},
{
  icon: Edit,
  title: "Edit Network Package",
  value: "Edit",
  color: "text-pink-600",
  bg: "bg-pink-100",
  clickable: true,
},
{
  icon: DollarSign, // any icon you want
  title: "Create Investment Package",
  value: "Add Package",
  color: "text-orange-600",
  bg: "bg-orange-100",
  clickable: true,
},
{
  icon: Edit,
  title: "Edit Investment Package",
  value: "Edit",
  color: "text-orange-600",
  bg: "bg-orange-100",
  clickable: true,
},
{
  icon: AlertCircle, // icon for withdrawal limit
  title: "Withdrawal Limit",
  value: "View Limit",
  color: "text-rose-600",
  bg: "bg-rose-100",
  clickable: true, // now clickable
},
{
  icon: CreditCard,
  title: "Payment Method",
  value: "Manage",
  color: "text-yellow-600",
  bg: "bg-yellow-100",
  clickable: true,
},
{
  icon: Bitcoin,
  title: "Crypto Withdraw",
  value: "Manage",
  color: "text-orange-600",
  bg: "bg-orange-100",
  clickable: true,
},
{
  icon: ArrowUpCircle,
  title: "Local Withdraw",
  value: "Manage",
  color: "text-rose-600",
  bg: "bg-rose-100",
  clickable: true,
},
{
  icon: ArrowDownCircle,
  title: "Local Deposit",
  value: "Manage",
  color: "text-emerald-600",
  bg: "bg-emerald-100",
  clickable: true,
},
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* 👋 Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-15 flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100 p-8 rounded-2xl shadow-lg w-full max-w-xl mx-auto mb-10 border border-sky-100"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: wave ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl"
          >
            👋
          </motion.span>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
          >
            Welcome back, Admin!
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-600 mt-3 text-lg"
        >
          Here’s a quick overview of your platform’s performance 🚀
        </motion.p>
      </motion.div>

      {/* 📊 Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map(({ icon: Icon, title, value, color, bg, clickable }, i) => (
   <motion.div
  key={i}
  onClick={() => {
    if (title === "Recent Activities") setOpenActivities(true);
    if (title === "Trading Deposit") setOpenTrading(true); 
      if (title === "Create Network Package") setOpenNetworkPackage(true);
  if (title === "Create Investment Package") setOpenInvestmentPackage(true);
    if (title === "Withdrawal Limit") setOpenWithdrawalLimit(true);
    if (title === "Payment Method") setOpenPaymentMethod(true);
      if (title === "Edit Network Package") setOpenEditNetwork(true); // ✅ new
  if (title === "Edit Investment Package") setOpenEditInvestment(true);
    if (title === "Crypto Withdraw") setOpenCryptoWithdraw(true);
  if (title === "Local Withdraw") setOpenLocalWithdraw(true);
  if (title === "Local Deposit") setOpenLocalDeposit(true);
 // ✅ new // ✅ new// ✅ open trading modal
  }}
  whileHover={{
    scale: 1.03,
    boxShadow: "0px 10px 20px rgba(56, 189, 248, 0.2)",
  }}
  className={`bg-white border border-sky-100 rounded-2xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all
    ${clickable ? "cursor-pointer hover:bg-gray-50" : ""}
  `}
>
  <div className={`p-3 rounded-full ${bg} ${color}`}>
    <Icon size={48} />
  </div>
  <div className="flex-1">
    <div className="flex items-center justify-between">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      {title === "Total Invested" && <CurrencyToggle />}
    </div>
    <h3 className={`text-2xl font-bold ${color} mt-1`}>{value}</h3>
  </div>
</motion.div>

        ))}
      </motion.div>
{/* 🔹 Trading Deposit Modal */}
{/* 🔹 Network Package Modal */}
{/* 🔹 Withdrawal Limit Modal */}
{/* 🔹 Payment Method Modal */}
{/* 🔹 Edit Network Package Modal */}
{/* 🔹 Crypto Withdraw Modal */}
<Modal
  isOpen={openCryptoWithdraw}
  onClose={() => setOpenCryptoWithdraw(false)}
  title="Crypto Withdraw"
>
  <AdminWithdrawals />
</Modal>

{/* 🔹 Local Withdraw Modal */}
<Modal
  isOpen={openLocalWithdraw}
  onClose={() => setOpenLocalWithdraw(false)}
  title="Local Withdraw"
>
  <AdminLocalWithdrawals/>
</Modal>

{/* 🔹 Local Deposit Modal */}
<Modal
  isOpen={openLocalDeposit}
  onClose={() => setOpenLocalDeposit(false)}
  title="Local Deposit"
>
   <AdminManualDeposits/>
</Modal>

<Modal
  isOpen={openEditNetwork}
  onClose={() => setOpenEditNetwork(false)}
  title="Edit Network Package"
>
 
   <Packagesadmin />
</Modal>

{/* 🔹 Edit Investment Package Modal */}
<Modal
  isOpen={openEditInvestment}
  onClose={() => setOpenEditInvestment(false)}
  title="Edit Investment Package"
>
  <EditPackage />
</Modal>
<Modal
  isOpen={openPaymentMethod}
  onClose={() => setOpenPaymentMethod(false)}
  title="Payment Method"
>
  <AdminPaymentMethods />
</Modal>

<Modal
  isOpen={openWithdrawalLimit}
  onClose={() => setOpenWithdrawalLimit(false)}
  title="Withdrawal Limit"
>
  <AdminWithdrawLimit /> {/* your component */}
</Modal>

<Modal
  isOpen={openNetworkPackage}
  onClose={() => setOpenNetworkPackage(false)}
  title="Create Network Package"
>
  <AdminAddPackage /> {/* your networking package component */}
</Modal>

{/* 🔹 Investment Package Modal */}
<Modal
  isOpen={openInvestmentPackage}
  onClose={() => setOpenInvestmentPackage(false)}
  title="Create Investment Package"
>
  < AdminAddInvestPackage /> {/* your investment package component */}
</Modal>

<Modal
  isOpen={openTrading}
  onClose={() => setOpenTrading(false)}
  title="Trading Deposit"
>
  <AdminTrading /> {/* your existing AdminTrading component */}
</Modal>

      {/* 🔹 Recent Activities Modal */}
      <Modal
        isOpen={openActivities}
        onClose={() => setOpenActivities(false)}
        title="Recent Activities"
      >
        <RecentActivities
          activities={[
            { message: "User John deposited $500", time: "2 minutes ago" },
            { message: "Withdrawal approved for Alice", time: "10 minutes ago" },
            { message: "New user registered", time: "1 hour ago" },
          ]}
        />
      </Modal>
    </div>
  );
}
