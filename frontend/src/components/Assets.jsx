import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAssetStore } from "../stores/assetStore";
import AssetCard from "../components/AssetCard";
import { Sparkles } from "lucide-react";

const Assets = () => {
  const { assets, getAssets } = useAssetStore();

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  // Loading / Empty State
  if (!assets.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Initializing market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* 🌌 Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-sky-100/50 blur-[120px] rounded-full" />
        <div className="absolute top-[5%] right-[-5%] w-[30%] h-[50%] bg-blue-100/40 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 py-20 px-6">
        
        {/* ✨ Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center space-x-2 bg-sky-50 border border-sky-100 px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} className="text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Premium Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Asset Based Claim <span className="text-sky-600">Earning</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Maximize your wealth with our automated liquidity pools. 
            Select an asset, set your quantity, and claim your daily rewards.
          </p>
        </motion.div>

        {/* 📊 Assets Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          {/* Stats Bar (Optional Touch) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
             {/* Add more tiny stats if needed */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {assets.map((asset, index) => (
              <motion.div
                key={asset._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AssetCard asset={asset} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🛡️ Footer Trust Badge */}
        <div className="mt-32 text-center">
           <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
             Encrypted & Secure Asset Management
           </p>
        </div>
      </div>
    </div>
  );
};

export default Assets;