import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";
import { Crown, Rocket, Star, Gem, Zap, Medal } from "lucide-react";

const icons = [Rocket, Star, Zap, Crown, Medal, Gem];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(packages);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axiosInstance.get("/packages");
        setPackages(data.packages);
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleBuy = async (packageId) => {
    try {
      const { data } = await axiosInstance.post("/packages/buy", { packageId });
      console.log("✅ Purchase successful:", data);
      alert(`Successfully purchased package!`);
    } catch (error) {
      console.error("❌ Error buying package:", error);
      alert("Failed to purchase package. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-sky-600 text-xl font-semibold">
        Loading Packages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-20 px-6">
      <h2 className="text-4xl font-bold text-center text-sky-700 mb-10">
        💎 Our Investment Packages
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {packages.map((pkg, index) => {
          const Icon = icons[index % icons.length];

          return (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-white border border-sky-100 shadow-lg hover:shadow-sky-200 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-100 rounded-full p-4 shadow-md">
                <Icon className="text-sky-600 w-6 h-6" />
              </div>

              <h3 className="text-2xl font-semibold mt-4 text-gray-800">
                {pkg.name}
              </h3>
              <p className="text-sky-700 text-3xl font-bold mt-2">
                ${pkg.price}
              </p>

              <div className="mt-6 space-y-2 text-gray-600">
                <p>⭐ Direct Referral Bonus: {pkg.commissions.level1}%</p>
                <p>⚡ Second Referral Bonus: {pkg.commissions.level2}%</p>
                <p>💠 Third Referral Bonus: {pkg.commissions.level3}%</p>
              </div>

              <div className="mt-6 text-sky-600 font-semibold">
                🎯 Level Reward: {pkg.levelRewardPercent}%
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBuy(pkg._id)}
                className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all"
              >
                Buy Now
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Packages;

