import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Users, Rocket, Crown } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Referral = () => {
  const { authUser } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const handleCopyAndShare = () => {
    const referralCode = authUser?.referralCode || "";
     const referralLink = `https://www.digitalwealthpk.com/signup?ref=${referralCode}`;
     
  const shareMessage = `
🚀 Join me on this amazing platform and start earning today!
Use my referral code: *${referralCode}* to get started.

👉 ${referralLink}
  `;

    // Copy referral code to clipboard
   

    // Try opening WhatsApp share (fallback to copy-only)
    const encodedMessage = encodeURIComponent(shareMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    try {
      // Opens WhatsApp Web or App
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error("WhatsApp share failed, fallback to copy only", err);
    }
  };
   const handleCopy = () => { 
    const referralCode = authUser?.referralCode || "";
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);}

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-16 px-6 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-600 mb-4">
          Turn Your Network Into Wealth 💸
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Every person you invite becomes part of your success story.  
          The more your team grows, the stronger your income foundation becomes.  
          <span className="text-sky-600 font-semibold"> It all starts with one share.</span>
        </p>
      </motion.div>

      {/* Referral Code Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="bg-white mt-10 shadow-xl border border-sky-100 rounded-2xl p-8 text-center w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 bg-sky-100 rounded-full w-32 h-32 blur-2xl opacity-40"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Unique Referral Code
        </h2>

        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl p-3">
          <span className="text-lg font-semibold text-sky-700 tracking-wide">
            {authUser?.referralCode || "Loading..."}
          </span>
          <button
            onClick={handleCopy}
            className="text-white bg-sky-500 hover:bg-sky-600 transition-all rounded-lg p-2"
          >
            <Copy size={18} />
          </button>
        </div>

        {copied && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mt-3 font-medium"
          >
            Copied! Share it and start building your empire 💎
          </motion.p>
        )}
      </motion.div>

      {/* Levels Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl"
      >
        {/* Level 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 border-t-4 border-sky-400 transition-all text-center"
        >
          <div className="flex justify-center mb-3">
            <Users className="text-sky-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-sky-600 mb-2">
            Direct Rewards
          </h3>
          <p className="text-gray-600 leading-relaxed">
            When someone joins using your code, you instantly grow your network.
            Every investment from your team gives you direct rewards — powered
            by the strength of <strong>your own package</strong>.
          </p>
        </motion.div>

        {/* Level 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 border-t-4 border-sky-400 transition-all text-center"
        >
          <div className="flex justify-center mb-3">
            <Rocket className="text-sky-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-sky-600 mb-2">
            Team Growth Income
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Your referrals start inviting others — and you still earn!  
            That’s how your network becomes a self-growing income system.
          </p>
        </motion.div>

        {/* Level 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 border-t-4 border-sky-400 transition-all text-center"
        >
          <div className="flex justify-center mb-3">
            <Crown className="text-sky-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-sky-600 mb-2">
            Legacy Earnings
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Even when your network expands beyond your direct team, you’ll keep
            earning continuously — that’s the power of a growing legacy.
          </p>
        </motion.div>
      </motion.div>

      {/* Motivation Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="mt-20 max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold text-sky-600 mb-4">
          Start Today — Your Code Is Your Key 🔑
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Share your code with friends, family, and your community.  
          Every connection you build adds power to your network.  
          <span className="text-sky-600 font-semibold">
            It’s not just sharing — it’s growing together.
          </span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleCopyAndShare}
          className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all"
        >
          Copy & Share My Code
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Referral;



