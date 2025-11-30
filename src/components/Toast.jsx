import { motion, AnimatePresence } from "framer-motion";

export const Toast = ({ notification, onClose }) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg border-2 ${
            notification.type === "success"
              ? "bg-black border-green-500 text-green-400 shadow-lg shadow-green-500/50"
              : "bg-black border-red-500 text-red-400 shadow-lg shadow-red-500/50"
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
