import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";
import Price from "./Price";
import { Crown, Rocket, Star, Gem, Zap, Medal } from "lucide-react";
import toast from "react-hot-toast";

const icons = [Rocket, Star, Zap, Crown, Medal, Gem];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [activatedId, setActivatedId] = useState(null);

  useEffect(() => {
    const fetchPackagesAndUser = async () => {
      try {
        // ✅ Fetch all packages
        const { data: pkgData } = await axiosInstance.get("/packages");
        setPackages(pkgData.packages.sort((a, b) => a.price - b.price));
        // ✅ Fetch user (to get currentPackage)
        const { data: userData } = await axiosInstance.get("/users/me");
        console.log(userData)
        setActivatedId(userData.currentPackage); // Restore activated package
      } catch (error) {
        console.error("❌ Error fetching packages or user:", error);
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesAndUser();
  }, []);

  const handleBuy = async (packageId) => {
    setBuying(packageId);
    try {
      const { data } = await axiosInstance.post("/packages/buy", { packageId });
      toast.success(data.message || "Successfully purchased package!");
      setActivatedId(packageId); // ✅ Update activated in frontend
    } catch (error) {
      console.error("❌ Error buying package:", error);
      const msg =
        error.response?.data?.message ||
        "Failed to purchase package. Please try again.";
      toast.error(msg);
    } finally {
      setBuying(null);
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
          const isActivated = pkg._id === activatedId;

          return (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isActivated ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white border border-sky-100 shadow-lg rounded-2xl p-8 text-center transition-all duration-300 
              ${
                activatedId && !isActivated
                  ? "blur-[0.6px] brightness-90 scale-[0.97]"
    : "hover:shadow-[0_0_25px_3px_rgba(255,0,0,0.6)] hover:scale-[1.03]"
              } 
              ${
                isActivated
                  ? "ring-4 ring-green-400 shadow-green-200 z-10"
                  : ""
              }`}
            >
              {/* Icon */}
              <div
                className={`absolute -top-6 left-1/2 -translate-x-1/2 rounded-full p-4 shadow-md transition-all ${
                  isActivated ? "bg-green-100" : "bg-sky-100"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActivated ? "text-green-600" : "text-sky-600"
                  }`}
                />
              </div>

              {/* Package Info */}
              <h3 className="text-2xl font-semibold mt-4 text-gray-800">
                {pkg.name}
              </h3>
              <p
                className={`text-3xl font-bold mt-2 ${
                  isActivated ? "text-green-700" : "text-sky-700"
                }`}
              >
               <Price amount={pkg.price} />
              </p>

              <div className="mt-6 space-y-2 text-gray-600">
                <p>⭐ Direct Referral Bonus: {pkg.commissions.level1}%</p>
                <p>⚡ Second Referral Bonus: {pkg.commissions.level2}%</p>
                <p>💠 Third Referral Bonus: {pkg.commissions.level3}%</p>
              </div>

              <div className="mt-6 text-sky-600 font-semibold">
                🎯 Level Reward: {pkg.levelRewardPercent}%
              </div>

              {/* Button or Activated State */}
              {isActivated ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 text-green-600 font-bold text-lg"
                >
                  ✅ Activated
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={buying === pkg._id}
                  onClick={() => handleBuy(pkg._id)}
                  className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-70"
                >
                  {buying === pkg._id ? (
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </div>
                  ) : (
                    "Buy Now"
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Packages;
