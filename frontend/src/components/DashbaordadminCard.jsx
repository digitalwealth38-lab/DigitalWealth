import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import Price from "./Price"; // make sure the path is correct
import { axiosInstance } from "../lib/axios";
import {
  Users,
  DollarSign,
  Briefcase,
  Coins,
  BarChart,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp 
} from "lucide-react";
import CurrencyToggle from "./CurrencyToggle";

export default function DashboardAdminCard() {
  const [stats, setStats] = useState(null);
  const [wave, setWave] = useState(false);

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
console.log(stats)
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
    icon:   TrendingUp ,
    title: "Trading Deposit",
    value: <Price amount={stats.tradingDeposit || 0} />,
     color: "text-green-600",
    bg: "bg-green-100",
  },
      {
    icon: Users,
    title: "Total Users",
    value: stats.totalUsers || 0, // not money, leave as is
    color: "text-indigo-600",
    bg: "bg-indigo-100",
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
       {cards.map(({ icon: Icon, title, value, color, bg }, i) => (
  <motion.div
    key={i}
    whileHover={{
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(56, 189, 248, 0.2)",
    }}
    className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
  >
    <div className={`p-3 rounded-full ${bg} ${color}`}>
      <Icon size={48} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm font-medium">{title}</p>

        {/* Show toggle only on "Total Users" card */}
        {title === "Total Invested" && <CurrencyToggle />}
      </div>
      <h3 className={`text-2xl font-bold ${color} mt-1`}>{value}</h3>
    </div>
  </motion.div>
))}
      </motion.div>
    </div>
  );
}


