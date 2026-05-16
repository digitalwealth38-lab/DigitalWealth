import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAssetStore } from "../stores/assetStore";
import MyAssetCard from "../components/MyAssetCard";
import { Wallet2 } from "lucide-react";

const MyAssets = () => {
  const { myAssets, getMyAssets } = useAssetStore();

  useEffect(() => {
    getMyAssets();
  }, [getMyAssets]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Background Orbs to match Assets page */}
      <div className="absolute top-0 right-0 w-[30%] h-[40%] bg-sky-100/40 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm mb-4">
            <Wallet2 size={16} className="text-sky-600" />
            <span className="text-sm font-bold text-slate-600">Investment Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Manage Your <span className="text-sky-600">Assets</span>
          </h1>
        </header>

        {myAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
           {myAssets
  .slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((investment) => (
    <MyAssetCard key={investment._id} investment={investment} />
  ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No active investments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssets;