import { motion } from "framer-motion";
import { useCurrency } from "./CurrencyContext";

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="relative flex items-center p-[2px] rounded-full bg-white/80 backdrop-blur-2xl border border-sky-100 shadow-xl">

      {/* Active Indicator */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
        className={`absolute h-6 w-9 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 ${
          currency === "USD" ? "left-[2px]" : "left-[38px]"
        }`}
      />

      <button
        onClick={() => currency !== "USD" && toggleCurrency()}
        className={`relative z-10 w-9 h-6 text-[9px] font-semibold rounded-full transition-all duration-300 ${
          currency === "USD"
            ? "text-white"
            : "text-slate-600 hover:text-sky-600"
        }`}
      >
        USD
      </button>

      <button
        onClick={() => currency !== "PKR" && toggleCurrency()}
        className={`relative z-10 w-9 h-6 text-[9px] font-semibold rounded-full transition-all duration-300 ${
          currency === "PKR"
            ? "text-white"
            : "text-slate-600 hover:text-sky-600"
        }`}
      >
        PKR
      </button>
    </div>
  );
};

export default CurrencyToggle;