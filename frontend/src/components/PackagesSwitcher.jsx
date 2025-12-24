import React, { useState } from "react";
import Deposit from "./Deposit"; 
import { motion } from "framer-motion";
import UserDepositPage from "./UserDepositPage"; 
import Packages from "./Packages";
import InvestPackages from "./Investmentpkg";

export default function PackagesSwitcher() {
  const [activeTab, setActiveTab] = useState("Network");

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
       <motion.h1
         initial={{ opacity: 0, y: -40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.7 }}
         className="text-6xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
       >
         Our  <span className="text-sky-500">Packages</span>
       </motion.h1>

      {/* Switcher Box */}
      <div className="flex items-center bg-white border border-sky-200 rounded-3xl shadow-md p-2 mb-10">

        {/* Crypto Button */}
        <button
          onClick={() => setActiveTab("Network")}
          className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            activeTab === "Network"
              ? "bg-sky-600 text-white shadow-md scale-105"
              : "text-sky-600 hover:bg-sky-100"
          }`}
        >
          Networking
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-sky-200 mx-3"></div>

        {/* Local Button */}
        <button
          onClick={() => setActiveTab("investment")}
          className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            activeTab === "investment"
              ? "bg-sky-600 text-white shadow-md scale-105"
              : "text-sky-600 hover:bg-sky-100"
          }`}
        >
          Investment
        </button>
      </div>

      {/* Active Component */}
      <div className="w-full max-w-6xl">
        {activeTab === "Network" && <Packages />}
        {activeTab === "investment" && <InvestPackages />}
      </div>
    </div>
  );
}
