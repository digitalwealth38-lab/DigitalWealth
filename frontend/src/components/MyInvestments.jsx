import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";
import Price from "./Price";
import { Crown, Rocket, Star, Gem, Zap, Medal } from "lucide-react";
import { CurrencyDollarIcon,ArrowTrendingUpIcon  } from "@heroicons/react/24/outline";

const icons = [Rocket, Star, Zap, Crown, Medal, Gem];

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyProfitSum, setDailyProfitSum] = useState(0);
  const [totalProfitSum, setTotalProfitSum] = useState(0);

  useEffect(() => {
    fetchMyInvestments();
  }, []);

const fetchMyInvestments = async () => {
  try {
    const res = await axiosInstance.get("/packages/my-investments");
    const data = Array.isArray(res.data) ? res.data : [];
    setInvestments(data);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    // Calculate today's profit
const dailyProfit = data.reduce((sum, inv) => sum + (inv.dailyProfit || 0), 0);
const totalProfit = data.reduce((sum, inv) => sum + (inv.roiCredited || 0), 0);
setDailyProfitSum(dailyProfit);
setTotalProfitSum(totalProfit);

  } catch (error) {
    console.error("Failed to fetch investments", error);
    setInvestments([]);
  } finally {
    setLoading(false);
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-sky-600 text-xl font-semibold">
        Loading Investments...
      </div>
    );
  }

  if (!investments.length) {
    return (
      
      <div className="text-center mt-20 text-gray-500">
         <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-lg">
    My Investments
  </h2>
        <p className="text-2xl font-semibold">No Investments Found</p>
        <p className="mt-2">Start investing to see your packages here</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-16 px-4">
<div className="text-center mb-12 overflow-visible">
  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-md leading-normal md:leading-normal">
    My Investments
  </h2>
  <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
    Explore all your active and completed investments with full ROI details, updated daily for accurate tracking.
  </p>
</div>



      {/* Profit Summary Block */}
<div className="max-w-4xl mx-auto mb-12 grid sm:grid-cols-2 gap-6">
  {/* Daily Profit Card */}
  <div className="relative overflow-hidden p-6 rounded-3xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
    {/* Background Accent Circle */}
    <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>

    <div className="relative z-10">
      <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold text-lg">
        <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
        Today Profit
      </div>
     

      <p className="mt-6 text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-2">
        <Price amount={dailyProfitSum} />
      </p>

      <p className="mt-3 text-sm text-blue-400 text-center">Updated daily at 12:00 AM</p>
    </div>
  </div>

  {/* Total Profit Card */}
  <div className="relative overflow-hidden p-6 rounded-3xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
    {/* Background Accent Circle */}
    <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>

    <div className="relative z-10">
      <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold text-lg">
        <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
        Total Profit
      </div>


      <p className="mt-6 text-4xl font-extrabold text-green-600 flex items-center justify-center gap-2">
        <Price amount={totalProfitSum} />
      </p>

      <p className="mt-3 text-sm text-green-400 text-center">Cumulative earnings of all investments</p>
    </div>
  </div>
</div>



     {/* Investment Cards */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {investments.map((inv, index) => {
    const Icon = icons[index % icons.length];
    const isExpired = new Date(inv.expiresAt).getTime() < Date.now();

    return (
      <motion.div
        key={inv._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className=" relative rounded-3xl overflow-hidden shadow-2xl transition-transform transform hover:scale-105 hover:shadow-3xl"
        style={{
          background: "white",
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Header */}
<div
  className="p-6 flex items-center gap-4 shadow-md rounded-lg"
  style={{
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  }}
>
  <div className="p-3 rounded-xl flex items-center justify-center bg-white/20">
    <Icon className="w-7 h-7 text-white" />
  </div>
  <div>
    <h3 className="text-xl font-bold text-white">{inv.packageName}</h3>
    <p
      className={`text-sm font-semibold ${
        inv.status === "COMPLETED" || isExpired
          ? "text-yellow-400"
          : "text-green-300"
      }`}
    >
      {inv.status}
    </p>
  </div>
</div>



        {/* Investment Amount */}
        <div className="p-6 text-center">
          <p className="text-black text-sm mb-1">Invested Amount</p>
          <div className="text-3xl font-extrabold text-black">
            <Price amount={inv.investedAmount} />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-3 text-black">
          <div className="flex justify-between border-b border-black/20 pb-2">
            <span>Capital:</span>
            <span className="font-semibold">
              <Price amount={inv.capital} />
            </span>
          </div>

          <div className="flex justify-between border-b border-black/20 pb-2">
            <span>Return ({inv.returnType}):</span>
            <span className="text-green-400 font-bold">
              <Price amount={inv.returnAmount} />
            </span>
          </div>

          <div className="flex justify-between border-b border-black/20 pb-2">
            <span>Total Profit:</span>
            <span className="text-yellow-400 font-bold">
              <Price amount={inv.totalProfit} />
            </span>
          </div>

          <div className="flex justify-between border-b border-black/20 pb-2">
            <span>Total Return:</span>
            <span className="font-bold text-lg">
              <Price amount={inv.totalReturn} />
            </span>
          </div>

          <div className="flex justify-between pt-2">
            <span>Duration:</span>
            <span className="font-semibold">{inv.durationDays} days</span>
          </div>

          <div className="flex justify-between">
            <span>Start:</span>
            <span className="font-semibold">
              {new Date(inv.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Expires:</span>
            <span className="font-semibold">
              {new Date(inv.expiresAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>ROI Credited:</span>
            <span className="font-semibold">
              <Price amount={inv.roiCredited} />
            </span>
          </div>

          <div className="flex justify-between">
            <span>Capital Returned:</span>
            <span className="font-semibold">
              {inv.capitalReturned ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Gradient overlay for aesthetic shine */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-tr from-white/10 via-white/5 to-white/0"></div>
      </motion.div>
    );
  })}
</div>
    </div>
  );
};

export default MyInvestments;
