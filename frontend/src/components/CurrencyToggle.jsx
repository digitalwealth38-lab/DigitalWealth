import { motion } from "framer-motion";
import { useCurrency } from "./CurrencyContext";

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center bg-white/80 backdrop-blur-md border border-sky-200 rounded-full shadow-lg p-1">
        
        {/* Sliding Indicator */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`absolute top-1 bottom-1 w-16 rounded-full bg-sky-500 ${
            currency === "USD" ? "left-1" : "left-[4.25rem]"
          }`}
        />

        {/* USD Button */}
        <button
          onClick={() => currency !== "USD" && toggleCurrency()}
          className={`relative z-10 w-16 py-1 text-sm font-semibold rounded-full transition-colors
            ${currency === "USD" ? "text-white" : "text-sky-600 hover:text-sky-800"}
          `}
        >
          USD $
        </button>

        {/* PKR Button */}
        <button
          onClick={() => currency !== "PKR" && toggleCurrency()}
          className={`relative z-10 w-16 py-1 text-sm font-semibold rounded-full transition-colors
            ${currency === "PKR" ? "text-white" : "text-sky-600 hover:text-sky-800"}
          `}
        >
          PKR ₨
        </button>
      </div>
    </div>
  );
};

export default CurrencyToggle;
