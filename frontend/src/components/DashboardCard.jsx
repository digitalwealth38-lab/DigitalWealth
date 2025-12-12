import WelcomeHeader from "./WelcomeHeader";
import { motion } from "framer-motion";
import { Wallet, DollarSign, Users, Gift, Trophy, Briefcase } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect } from "react";

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
  { icon: Wallet, title: "Total Balance", value: `$${(user?.balance || 0).toFixed(2)}`, color: "text-sky-600" },
  { icon: Briefcase, title: "Invested Balance", value: `$${(user?.investedBalance || 0).toFixed(2)}`, color: "text-blue-600" },
  { icon: DollarSign, title: "Total Earnings", value: `$${(user?.totalEarnings || 0).toFixed(2)}`, color: "text-green-600" },
  { icon: Users, title: "Team Size", value: `${user?.teamSize || 0} Members`, color: "text-indigo-600" },
  { icon: Gift, title: "Direct Referrals", value: `${user?.directReferrals || 0}`, color: "text-purple-600" },
  { icon: Trophy, title: "Level", value: user?.level || "0", color: "text-yellow-600" },
];

  return (
    <div
    >
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <WelcomeHeader />
<div className="fixed right-4 top-28 w-80 sm:w-96 bg-white border border-sky-200 shadow-xl rounded-xl p-5 z-50">
  <div className="flex justify-between items-start">
    <h2 className="text-lg font-bold text-sky-700">🔔 Coming Soon!</h2>

    <button
      onClick={(e) => {
        e.target.closest("div.fixed").style.display = "none";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500 hover:text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>

  <p className="text-gray-600 mt-2 text-sm">
    A new <strong>Ticket & Lucky Draw System</strong> is launching on <strong>1 January</strong>.
  </p>

  <ul className="list-disc ml-5 mt-3 text-sm text-gray-700">
    <li>Tickets added automatically when you buy any package.</li>
    <li>You can buy extra tickets separately.</li>
    <li>Old users get tickets based on active packages.</li>
    <li>Use tickets to join Weekly & Monthly Lucky Draws.</li>
  </ul>

  <p className="mt-3 text-sky-600 font-medium text-sm">
    Get ready — exciting rewards are on the way!
  </p>
</div>
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
              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
