import React from "react";
import { motion } from "framer-motion";
import { useAssetStore } from "../stores/assetStore";
import { Calendar, Wallet, ArrowUpRight, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import Price from "./Price";

const MyAssetCard = ({ investment }) => {
  console.log(investment)
  const { claimReward } = useAssetStore();

  // Premium Date Formatter: "13 May 2026"
  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const daysLeft = Math.max(0, investment.duration - investment.claimedDays);
  const progressPercentage = Math.min((investment.claimedDays / investment.duration) * 100, 100);
  const isActive = investment.active;
  const claimedToday =
    investment.lastClaimDate &&
    new Date(investment.lastClaimDate).toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`relative bg-white border ${
        isActive ? "border-slate-100" : "border-red-100"
      } rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-6 pt-16 mt-12 transition-all duration-300`}
    >
      {/* 🚀 Floating Circular Image Section - POSITION PRESERVED */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="relative p-1.5 bg-white rounded-full shadow-2xl">
          <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 ${
            isActive ? "border-sky-50 shadow-inner" : "border-red-50"
          }`}>
            <img
              src={investment.assetImage}
              alt={investment.assetName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          {/* High-End Status Indicator */}
          <div className="absolute bottom-1 right-1 border-4 border-white w-7 h-7 rounded-full shadow-lg overflow-hidden">
             <div className={`absolute inset-0 animate-pulse ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
             <div className="absolute inset-0 bg-white/20 blur-[1px]" />
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-[1000] text-slate-800 tracking-tight leading-tight">
          {investment.assetName}
        </h2>
        
        <div className="flex flex-col items-center gap-2 mt-2">
          {isActive ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50/50 border border-sky-100 rounded-full">
              <ShieldCheck size={12} strokeWidth={3} /> Asset Investment Active
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 rounded-full">
              <AlertCircle size={12} strokeWidth={3} /> Asset Investment Expired
            </div>
          )}
          
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <span>Capital Status:</span>
            <span className={investment.capitalReturned ? "text-emerald-600" : "text-amber-500"}>
              {investment.capitalReturned ? "Returned" : "In Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
{/* Premium Bento Stats Grid - Website Theme: Sky Blue */}
<div className="grid grid-cols-2 gap-3 mb-6">
  
  {/* 1. Invested Amount - Sky Blue Primary */}
  <div className="bg-sky-50/50 backdrop-blur-md p-4 rounded-[1.8rem] border border-sky-100 hover:bg-white hover:shadow-md transition-all duration-300">
    <p className="text-[9px] text-sky-600 uppercase font-black tracking-widest mb-1">Invested Amount</p>
    <p className="text-slate-900 text-lg font-[1000] flex items-baseline gap-0.5">
       <Price amount={investment.investedAmount} />
    </p>
  </div>

  {/* 2. Quantity - Clean Slate */}
<div className="bg-slate-50/50 backdrop-blur-md p-4 rounded-[1.8rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">
    Quantity
  </p>

  <p className="text-slate-800 text-lg font-[1000] flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)] inline-block" />

    {investment.quantity}

    <span className="text-[10px] text-slate-400 font-black uppercase">
      Units
    </span>
  </p>
</div>

  {/* 3. Daily Profit - Success Emerald */}
  <div className="bg-emerald-50/30 backdrop-blur-md p-4 rounded-[1.8rem] border border-emerald-100 hover:bg-white hover:shadow-md transition-all duration-300">
    <p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest mb-1">Daily Profit</p>
    <p className="text-emerald-700 text-lg font-[1000] flex items-center gap-1">
       <ArrowUpRight size={16} strokeWidth={3} className="text-emerald-500" />
       <span className="text-xs font-bold">+</span><Price amount={investment.profitPerDay} />
    </p>
  </div>

  {/* 4. Total Profit - Success Emerald */}
  <div className="bg-emerald-50/30 backdrop-blur-md p-4 rounded-[1.8rem] border border-emerald-100 hover:bg-white hover:shadow-md transition-all duration-300">
    <p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest mb-1">Total Profit</p>
    <p className="text-emerald-700 text-lg font-[1000] flex items-center gap-1">
       <ArrowUpRight size={16} strokeWidth={3} className="text-emerald-500" />
       <span className="text-xs font-bold">+</span><Price amount={investment.totalProfit} />
    </p>
  </div>

  {/* 5. Claimed Amount - Soft Sky Blue */}
  <div className="bg-sky-50/30 backdrop-blur-md p-4 rounded-[1.8rem] border border-sky-100 hover:bg-white hover:shadow-md transition-all duration-300">
    <p className="text-[9px] text-sky-600 uppercase font-black tracking-widest mb-1">Claimed Amount</p>
    <p className="text-sky-700 text-lg font-[1000] flex items-center gap-1">
       <CheckCircle2 size={16} strokeWidth={3} className="text-sky-500" />
       <Price amount={investment.claimedAmount} />
    </p>
  </div>

  {/* 6. Total Return - Premium Sky-Glass (Fixed Background) */}
  <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-4 rounded-[1.8rem] shadow-[0_10px_20px_-5px_rgba(14,165,233,0.3)] relative overflow-hidden group border border-sky-400">
    {/* Subtle Glass Overlay */}
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    
    <p className="text-[9px] text-sky-100 uppercase font-black tracking-[0.15em] mb-1 relative z-10">Total Return</p>
    <p className="text-white text-lg font-[1000] flex items-center gap-1 relative z-10">
       <span className="text-xs text-sky-200 font-bold">+</span><Price amount={investment.totalReturn} />
    </p>
    
    {/* Animated Shine */}
    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 pointer-events-none" />
  </div>

</div>

      {/* Date Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
          <div className="p-2 bg-sky-50 rounded-xl text-sky-500"><Clock size={16} /></div>
          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase">Started</p>
            <p className="text-[11px] font-bold text-slate-700">{formatDate(investment.startDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
          <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><Calendar size={16} /></div>
          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase">Till</p>
            <p className="text-[11px] font-bold text-slate-700">{formatDate(investment.endDate)}</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 px-1 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Claim Progress</span>
          <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="relative w-full h-4 bg-slate-100 rounded-full p-1 border border-slate-100">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className={`h-full rounded-full ${
              isActive ? "bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-300"
            }`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
           <span className={isActive ? "text-sky-600" : "text-slate-500"}>No Of Claimed Days:{investment.claimedDays}</span>
        </div>
      </div>

      {/* Claim Button */}
<button
  onClick={() => claimReward(investment._id)}
  disabled={!isActive || claimedToday}
  className={`group relative w-full overflow-hidden p-5 rounded-[2.2rem] transition-all duration-500 border-none ${
    !isActive
      ? "bg-slate-100 cursor-not-allowed border border-slate-200 shadow-none"
      : claimedToday
      ? "bg-emerald-600 shadow-[0_15px_30px_-10px_rgba(5,150,105,0.4)] cursor-not-allowed" 
      : "bg-sky-600 hover:bg-sky-700 hover:shadow-[0_20px_40px_-10px_rgba(2,132,199,0.5)] active:scale-[0.97]"
  }`}
>
  <div className="relative z-10 flex justify-between items-center px-1">
    <div className="text-left">
      <p className={`text-[9px] font-[1000] uppercase tracking-[0.2em] mb-0.5 ${
        !isActive ? "text-slate-400" : claimedToday ? "text-emerald-100" : "text-sky-100/80"
      }`}>
        {!isActive ? "Closed" : claimedToday ? "Successfully" : "Available"}
      </p>
      <p className={`text-xl font-[1000] tracking-tight ${
        !isActive ? "text-slate-600" : claimedToday ? "text-white" : "text-white"
      }`}>
        {!isActive ? "Finished" : claimedToday ? "Reward Secured" : "Claim Reward"}
      </p>
    </div>
    
    <div className={`p-3 rounded-2xl transition-all duration-500 ${
      !isActive ? "bg-slate-200 text-slate-400" : 
      claimedToday ? "bg-white/20 text-white shadow-md" : 
      "bg-white/20 text-white group-hover:bg-white group-hover:text-sky-600 group-hover:rotate-[360deg]"
    }`}>
       {!isActive || claimedToday ? <CheckCircle2 size={24} strokeWidth={3} /> : <Wallet size={24} strokeWidth={3} />}
    </div>
  </div>
  
  {/* Premium Shine Flare - Visible on Sky Blue & Green backgrounds */}
  {isActive && (
      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000" />
  )}
</button>
    </motion.div>
  );
};

export default MyAssetCard;