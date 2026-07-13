import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, User, X, ShieldCheck, Eye, BadgeCheck, CheckCircle2 } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";

const WithdrawalProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProofs = async () => {
    try {
      const res = await axiosInstance.get("/WithdrawalProofs");
      setProofs(res.data.proofs || []);
    } catch (error) {
      console.log("Fetch withdrawal proofs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100/50 text-cyan-700 font-medium text-sm mb-4">
            <BadgeCheck size={16} />
            <span>Verified Transactions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Withdrawal <span className="text-cyan-600">Proof</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Transparency at its best. See our latest successful withdrawals from our global community.
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proofs.map((proof, index) => (
            <motion.div
              key={proof._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px]">
                    <img src={proof.image} alt={proof.username} className="w-full h-full object-cover rounded-[14px]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{proof.username}</h3>
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Verified User</p>
                </div>
              </div>

              {/* Image Preview */}
              <div 
                onClick={() => setSelectedImage(proof.image)}
                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-slate-100"
              >
                <img src={proof.image} alt="proof" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="text-white" size={32} />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-slate-400 text-sm font-medium">Status</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} />
                  Confirmed
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition"
              >
                <X size={32} />
              </button>
              <img src={selectedImage} alt="preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WithdrawalProofs;