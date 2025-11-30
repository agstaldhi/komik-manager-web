import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationToast({ notification }) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-md border ${
            notification.type === "error"
              ? "border-red-600 bg-black text-red-400"
              : "border-green-500 bg-black text-green-300"
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
