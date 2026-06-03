import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAssetStore } from "../stores/assetStore";
import { Plus, Minus, TrendingUp } from "lucide-react"; // Optional: for cleaner icons
import Price from "./Price";

const AssetCard = ({ asset }) => {
  console.log(asset)
  const [quantity, setQuantity] = useState(1);
  
  const { buyAsset,buyingAssetId } = useAssetStore();

  const total = quantity * asset.price;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative bg-white border border-sky-50 rounded-[2.5rem] shadow-[0_10px_30px_-15px_rgba(2,132,199,0.2)] hover:shadow-[0_20px_40px_-15px_rgba(2,132,199,0.3)] transition-all duration-300 p-6 pt-20"
    >
      {/* 🚀 Floating Badge & Image */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="relative p-1 bg-white rounded-full shadow-xl">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-sky-100"
          />
          <div className="absolute bottom-1 right-1 bg-sky-600 text-white p-2 rounded-full shadow-lg">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          {asset.name}
        </h2>
        <span className="inline-block px-3 py-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 rounded-full">
          Premium Asset
        </span>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl border border-gray-50">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Duration</p>
          <p className="text-gray-900 font-bold">{asset.duration} Days</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
          <p className="text-[10px] text-emerald-500 uppercase font-bold">Profit per Unit</p>
          <p className="text-emerald-600 font-bold">+<Price amount={asset.profitPerProduct} /></p>
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-3 px-1 text-sm border-b border-gray-100 pb-5">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium">Product Price</span>
          <span className="text-gray-800 font-bold">
            <Price amount={asset.price} />
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium">Limits</span>
          <span className="text-gray-500 text-xs font-semibold">
            {asset.minPurchase} - {asset.maxPurchase} Units
          </span>
          
        </div>
      </div>

      {/* Quantity & Total Section */}
      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center space-x-6 mb-4">
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="w-8 h-8 rounded-full border-2 border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>

          <span className="text-2xl font-black text-gray-800 w-8 text-center">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border-2 border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="w-full bg-sky-600 p-4 rounded-[1.5rem] shadow-lg shadow-sky-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sky-100 text-[10px] font-bold uppercase">Total Payable</p>
              <div className="text-white text-xl font-bold">
                <Price amount={total} />
              </div>
            </div>
     <button
  onClick={() => buyAsset(asset._id, quantity)}
  disabled={buyingAssetId === asset._id}
  className="bg-white text-sky-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors disabled:opacity-70 flex items-center gap-2"
>
  {buyingAssetId === asset._id ? (
    <>
      <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      Buying...
    </>
  ) : (
    "Buy Now"
  )}
</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetCard;