import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const ModalLogout = ({ isOpen, onConfirm, onCancel }) => {
  const { darkMode } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`${
              darkMode
                ? "bg-black border-green-500 shadow-green-500/30"
                : "bg-white border-gray-300 shadow-gray-500/30"
            } border-2 rounded-lg p-8 max-w-sm w-full shadow-xl`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-green-400" : "text-gray-800"}`}>
              Konfirmasi Logout
            </h3>
            <p className={`mb-6 ${darkMode ? "text-green-300" : "text-gray-600"}`}>
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className={`flex-1 ${darkMode ? "bg-red-600 hover:bg-red-700 shadow-red-600/50" : "bg-red-500 hover:bg-red-600 shadow-red-500/50"} text-white py-2 rounded-lg transition-all shadow-lg font-bold`}
              >
                Keluar
              </button>
              <button
                onClick={onCancel}
                className={`flex-1 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} py-2 rounded-lg transition-all font-bold`}
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
