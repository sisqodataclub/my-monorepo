import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SuccessModal = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 text-center max-w-sm w-full"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Booking Completed 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              Your booking has been received. Please check your email for full
              confirmation details.
            </p>

            <button
              onClick={onClose}
              className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
