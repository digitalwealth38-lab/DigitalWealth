import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";
import Price from "./Price";
import { Crown, Rocket, Star, Gem, Zap, Medal } from "lucide-react";
import toast from "react-hot-toast";

const icons = [Rocket, Star, Zap, Crown, Medal, Gem];

const InvestPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    const fetchPackagesAndUser = async () => {
      try {
        const { data: pkgData } = await axiosInstance.get("/packages/investpackages");
        setPackages(pkgData.packages.sort((a, b) => a.investmentAmount - b.investmentAmount));
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
        toast.error("Failed to load investment packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackagesAndUser();
  }, []);

  const handleBuy = async (packageId) => {
    setBuying(packageId);
    try {
      const { data } = await axiosInstance.post("packages/buyinvestpackages", { packageId });
      toast.success(data.message || "✅ Investment package purchased!");
    } catch (error) {
      console.error("❌ Error buying package:", error);
      toast.error(error.response?.data?.message || "Failed to purchase package");
    } finally {
      setBuying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-sky-600 text-xl font-semibold">
        Loading Investment Packages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-16 px-4">
  <div className="text-center mb-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-lg leading-tight md:leading-snug">
    Our Investment Packages
  </h2>
  <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
    Choose your investment plan and start earning daily returns, with full transparency and easy tracking.
  </p>
</div>


     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {packages.map((pkg, index) => {
    const Icon = icons[index % icons.length];

    return (
      <motion.div
        key={pkg._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative  rounded-3xl overflow-hidden shadow-2xl transition-transform transform hover:scale-105 hover:shadow-3xl"
        style={{
          background: "white",
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Header with Icon */}
   <div
  className="p-6 flex items-center gap-4"
  style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)" }}
>
  <div className="p-3 rounded-xl flex items-center justify-center bg-white/20">
    <Icon className="w-7 h-7 text-white" />
  </div>
  <div>
    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
    <p className="text-white text-sm">Premium Investment Plan</p>
  </div>
</div>



        {/* Investment Amount */}
        <div className="p-6 text-center">
          <p className="text-balck text-sm mb-1">Investment</p>
          <div className="text-3xl font-extrabold text-black">
            <Price amount={pkg.investmentAmount} />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-3 text-black">
          <div className="flex justify-between items-center border-b border-black/20 pb-2">
            <span className="text-black">Duration:</span>
            <span className="font-semibold">{pkg.durationDays} days</span>
          </div>

          <div className="flex justify-between items-center border-b border-black/20 pb-2">
            <span className="text-black">
              {pkg.returnType === "DAILY" ? "Daily Return:" : "Weekly Return:"}
            </span>
            <span className="text-green-400 font-bold">
              <Price amount={pkg.pkgReturn} />
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-black/20 pb-2">
            <span className="text-black">Total Profit:</span>
            <span className="text-yellow-400 font-bold">
              <Price amount={pkg.totalProfit} />
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-black/20 pb-2">
            <span className="text-black">Total Return:</span>
            <span className="font-bold text-lg text-black">
              <Price amount={pkg.totalReturn} />
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-black">Expires:</span>
            <span className="font-semibold text-black">
              {new Date(pkg.packageExpiresAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-4 p-3 bg-black/10 rounded-lg flex justify-between items-center">
            <span className="text-black">Capital Return:</span>
            <span className="font-semibold text-black">
              <Price amount={pkg.capital} />
            </span>
          </div>

          {/* Invest Button */}
   <motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  disabled={buying === pkg._id}
  onClick={() => handleBuy(pkg._id)}
  className="
    w-full
    font-bold py-3 rounded-xl
    shadow-lg transition-all disabled:opacity-70
  "
  style={{
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "white",
  }}
>
  {buying === pkg._id ? (
    <div className="flex justify-center items-center gap-2">
      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      Processing Purchase...
    </div>
  ) : (
    "Invest Now"
  )}
</motion.button>


        </div>

        {/* Subtle gradient overlay for shine effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-tr from-white/10 via-white/5 to-white/0"></div>
      </motion.div>
    );
  })}
</div>


      {/* Legend/Info Section */}
    <div className="mt-12 max-w-4xl mx-auto p-6 bg-gradient-to-br from-sky-700/60 via-sky-800/50 to-sky-900/70 backdrop-blur-lg rounded-3xl border border-sky-500 shadow-2xl text-white">
  <h3 className="text-2xl font-extrabold mb-6 text-center text-white drop-shadow-md">
    Investment Terms
  </h3>

  <div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-3">
      <p className="flex items-start gap-2">
        <span className="text-blue-300 font-bold">•</span>
        Daily returns are credited to your account balance
      </p>
      <p className="flex items-start gap-2">
        <span className="text-blue-300 font-bold">•</span>
        Capital amount is returned after the duration period
      </p>
     
    </div>

    <div className="space-y-3">
      <p className="flex items-start gap-2">
        <span className="text-blue-300 font-bold">•</span>
        Returns are calculated based on your investment
      </p>
      <p className="flex items-start gap-2">
        <span className="text-blue-300 font-bold">•</span>
        Support available 24/7 for all investors
      </p>
    </div>
  </div>
</div>

    </div>
  );
};

export default InvestPackages;
