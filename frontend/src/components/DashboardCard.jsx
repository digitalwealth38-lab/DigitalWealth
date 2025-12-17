import WelcomeHeader from "./WelcomeHeader";
import { motion } from "framer-motion";
import Price from "./Price";
import { Wallet, DollarSign, Users, Gift, Trophy, Briefcase } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect } from "react";
import CurrencyToggle from "./CurrencyToggle";

export default function DashboardCard() {
     const { user, fetchUser } = useUserStore();
    useEffect(() => {
    fetchUser();// fetch user on component mount
  }, []);
  console.log(user)
  
  if (!user) return   <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>;
const stats = [
  {
    icon: Wallet,
    title: "Total Balance",
    value: <Price amount={user?.balance || 0} />,
    color: "text-sky-600",
    
  },
  {
    icon: Briefcase,
    title: "Invested Balance",
    value: <Price amount={user?.investedBalance || 0} />,
    color: "text-blue-600",
  },
  {
    icon: DollarSign,
    title: "Total Earnings",
    value: <Price amount={user?.totalEarnings || 0} />,
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "Team Size",
    value: `${user?.teamSize || 0} Members`,
    color: "text-indigo-600",
  },
  {
    icon: Gift,
    title: "Direct Referrals",
    value: `${user?.directReferrals || 0}`,
    color: "text-purple-600",
  },
  {
    icon: Trophy,
    title: "Level",
    value: user?.level || "0",
    color: "text-yellow-600",
  },
];

  return (
    <div
    >
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <WelcomeHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {stats.map(({ icon: Icon, title, value, color }, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 20px rgba(56, 189, 248, 0.2)",
              }}
              className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
            >
              <div className={`p-3 rounded-full bg-sky-100 ${color}`}>
                <Icon size={50} />
              </div>
            <div className="w-full">
  <div className="flex items-center justify-between">
    <p className="text-gray-500 text-sm">{title}</p>

    {title === "Total Balance" && (
      <CurrencyToggle />
    )}
  </div>

  <h3 className={`text-2xl font-bold ${color} mt-1`}>
    {value}
  </h3>
</div>

            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
