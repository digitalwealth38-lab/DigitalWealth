import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/userStore";

export default function WelcomeHeader() {
  const [wave, setWave] = useState(false);
   const { user, fetchUser } = useUserStore();
    useEffect(() => {
    fetchUser();// fetch user on component mount
  }, []);
  
  if (!user) return   <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>;
      useEffect(() => {
    const interval = setInterval(() => {
      setWave((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className=" mt-15 flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100 p-8 rounded-2xl shadow-lg w-full max-w-xl mx-auto mb-10 border border-sky-100"
    >
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ rotate: wave ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl"
        >
          👋
        </motion.span>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
        >
          Welcome back, {user.name}!
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-gray-600 mt-3 text-lg"
      >
        Let’s check your investment progress 🚀
      </motion.p>
    </motion.div>
  );
}
