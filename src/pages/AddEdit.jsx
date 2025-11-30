import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const AddEdit = ({ editingComic, onSave, onCancel }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    episode: "",
    link: "",
  });

  useEffect(() => {
    if (editingComic) {
      setFormData({
        title: editingComic.title,
        episode: editingComic.episode,
        link: editingComic.link,
      });
    } else {
      setFormData({ title: "", episode: "", link: "" });
    }
  }, [editingComic]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto"
    >
      <div
        className={`border-2 ${
          darkMode ? "border-green-500 bg-black/30" : "border-gray-300 bg-white"
        } rounded-xl p-8 shadow-2xl ${darkMode && "shadow-green-500/20"}`}
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? "text-green-400" : "text-gray-800"
          }`}
        >
          {editingComic ? "✏️ Edit Komik" : "➕ Tambah Komik Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block mb-2 font-bold ${
                darkMode ? "text-green-400" : "text-gray-700"
              }`}
            >
              Judul
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                darkMode
                  ? "border-green-500 bg-black text-green-400 focus:shadow-lg focus:shadow-green-500/50"
                  : "border-gray-300 bg-white text-gray-800 focus:border-green-500"
              } outline-none transition-all`}
              placeholder="Masukkan judul komik..."
              required
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-bold ${
                darkMode ? "text-green-400" : "text-gray-700"
              }`}
            >
              Episode
            </label>
            <input
              type="number"
              value={formData.episode}
              onChange={(e) =>
                setFormData({ ...formData, episode: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                darkMode
                  ? "border-green-500 bg-black text-green-400 focus:shadow-lg focus:shadow-green-500/50"
                  : "border-gray-300 bg-white text-gray-800 focus:border-green-500"
              } outline-none transition-all`}
              placeholder="Masukkan episode..."
              required
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-bold ${
                darkMode ? "text-green-400" : "text-gray-700"
              }`}
            >
              Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                darkMode
                  ? "border-green-500 bg-black text-green-400 focus:shadow-lg focus:shadow-green-500/50"
                  : "border-gray-300 bg-white text-gray-800 focus:border-green-500"
              } outline-none transition-all`}
              placeholder="Masukkan link komik..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${
                darkMode
                  ? "border-green-500 bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/50"
                  : "border-green-600 bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {editingComic ? "💾 Update" : "➕ Tambah"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                darkMode
                  ? "border-green-500/50 text-green-400 hover:border-green-500"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              ❌ Batal
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
