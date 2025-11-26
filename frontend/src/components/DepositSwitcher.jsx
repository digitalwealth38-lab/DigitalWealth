import React, { useState } from "react";
import Deposit from "./Deposit"; 
import { motion } from "framer-motion";
import UserDepositPage from "./UserDepositPage"; 

export default function DepositSwitcher() {
  const [activeTab, setActiveTab] = useState("crypto");

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16">
       <motion.h1
         initial={{ opacity: 0, y: -40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.7 }}
         className="text-6xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
       >
         Deposit  <span className="text-sky-500">Funds</span>
       </motion.h1>

      {/* Switcher Box */}
      <div className="flex items-center bg-white border border-sky-200 rounded-3xl shadow-md p-2 mb-10">

        {/* Crypto Button */}
        <button
          onClick={() => setActiveTab("crypto")}
          className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            activeTab === "crypto"
              ? "bg-sky-600 text-white shadow-md scale-105"
              : "text-sky-600 hover:bg-sky-100"
          }`}
        >
          Crypto Deposit
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-sky-200 mx-3"></div>

        {/* Local Button */}
        <button
          onClick={() => setActiveTab("local")}
          className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            activeTab === "local"
              ? "bg-sky-600 text-white shadow-md scale-105"
              : "text-sky-600 hover:bg-sky-100"
          }`}
        >
          Local Bank Deposit
        </button>
      </div>

      {/* Active Component */}
      <div className="w-full max-w-6xl">
        {activeTab === "crypto" && <Deposit />}
        {activeTab === "local" && <UserDepositPage />}
      </div>
    </div>
  );
}
