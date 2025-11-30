import { motion, AnimatePresence } from "framer-motion";

export const ModalDelete = ({ comic, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {comic && (
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
            className="bg-black border-2 border-green-500 rounded-lg p-8 max-w-md w-full shadow-xl shadow-green-500/30"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-green-300 mb-6">
              Yakin ingin menghapus "{comic.title}"?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all shadow-lg shadow-red-600/50"
              >
                Hapus
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all"
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
