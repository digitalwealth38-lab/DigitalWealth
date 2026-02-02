import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/axios";
import { Trophy, Gift, Info, Star } from "lucide-react";

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const ProgressRewards = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/users/me`);
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>User not found</p>;

  const { level, directReferrals, rewards } = userData;
  const progress = (directReferrals % 10) * 10; // 10 referrals = 1 level
  const nextLevel = level + 1;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* ✨ Beautiful Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-sky-600 mb-10 drop-shadow-lg">
        🚀  Reward Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE – Progress and Rewards */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
          {/* Current Level */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-sky-600 flex justify-center items-center gap-2">
              <Trophy className="text-yellow-500" /> Level {level}
            </h2>
            <p className="text-gray-600">
              {directReferrals} Direct Referrals — Progress to Level {nextLevel}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <motion.div
              className="bg-sky-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <p className="text-center text-sm text-gray-500 mb-8">
            {progress}% complete to next level
          </p>

          {/* Reward History */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-sky-700 flex items-center gap-2 mb-3">
              <Gift className="text-pink-500" /> Reward History
            </h3>

            <div className="max-h-96 overflow-y-auto bg-sky-50 border border-sky-100 rounded-xl p-3">
              {rewards && rewards.length > 0 ? (
              <ul className="space-y-3">
  {rewards
    .slice()
    .reverse()
    .map((reward, index) => (
      <li
        key={reward._id || index}
        className="p-4 bg-white border border-sky-100 rounded-xl shadow-sm flex items-center justify-between gap-4"
      >
        {/* LEFT: TYPE */}
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500" size={18} />
          <div>
            <p className="font-semibold text-sky-700">
              {reward.type}
            </p>
            <p className="text-xs text-gray-400">
              {formatDateTime(reward.date)}
            </p>
          </div>
        </div>

        {/* RIGHT: AMOUNT */}
        <div className="text-emerald-600 font-bold text-lg">
          +${reward.amount.toFixed(2)}
        </div>
      </li>
    ))}
</ul>
              ) : (
                <p className="text-gray-500 text-center">No rewards earned yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – Reward Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold text-sky-600 flex items-center gap-2 mb-4">
              <Info className="text-sky-500" /> Reward Information
            </h2>

            <p className="text-gray-600 mb-4">
              Earn rewards as you refer more users! Each new referral helps you
              level up and unlock bonuses.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <h3 className="text-sky-700 font-semibold flex items-center gap-2">
                  <Star className="text-yellow-500" /> How Rewards Work
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  • You earn a reward whenever you complete 10 direct referrals.<br />
                  • The reward amount depends on your current package level reward percentage.<br />
                  • Higher levels unlock bigger rewards.
                </p>
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <h3 className="text-sky-700 font-semibold flex items-center gap-2">
                  <Trophy className="text-orange-500" /> Level System
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  • Level 0: 0–9 referrals<br />
                  • Level 1: 10–19 referrals<br />
                  • Level 2: 20–29 referrals<br />
                  • Level 3: 30–39 referrals<br />
                  • Level 4: 40–49 referrals<br />
                  • Level 5: 50–59 referrals<br />
                  • Level 6: 60–69 referrals<br />
                  • Level 7: 70–79 referrals<br />
                  • Level 8: 80–89 referrals<br />
                  • Level 9: 90–99 referrals<br />
                  • ... and so on up to Level 100.<br />
                  • Each 10 direct referrals increase your level by 1 and unlock a new milestone reward!
                </p>
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <h3 className="text-sky-700 font-semibold flex items-center gap-2">
                  <Gift className="text-pink-500" /> Example
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  When you refer 10 people, you’ll move up one level and receive a reward based on 
                  your current package <span className="font-medium text-sky-600">level reward percentage</span>. 
                  The earned reward will automatically appear in your reward history list on the left side.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRewards;


