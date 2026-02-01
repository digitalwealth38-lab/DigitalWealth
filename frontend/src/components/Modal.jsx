// components/Modal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button onClick={onClose}>
                  <X className="text-gray-500 hover:text-gray-800" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
