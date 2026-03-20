import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const AddEdit = ({ editingComic, onSave, onCancel, onUploadJSON }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    episode: "",
    link: "",
    isNSFW: false, // ⬅️ Add NSFW field
  });

  useEffect(() => {
    if (editingComic) {
      setFormData({
        title: editingComic.title,
        episode: editingComic.episode,
        link: editingComic.link,
        isNSFW: editingComic.isNSFW || false, // ⬅️ Load NSFW value
      });
    } else {
      setFormData({ title: "", episode: "", link: "", isNSFW: false });
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
      className="w-full max-w-5xl mx-auto"
    >
      <div
        className={`border-2 ${darkMode ? "border-green-500 bg-black/30" : "border-gray-300 bg-white"} rounded-2xl p-6 sm:p-10 shadow-2xl ${darkMode && "shadow-green-500/20"}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2
            className={`text-3xl font-bold ${darkMode ? "text-green-400" : "text-gray-800"}`}
          >
            {editingComic ? "✏️ Edit Komik" : "➕ Tambah Komik Baru"}
          </h2>
          
          {/* Upload JSON Button */}
          {!editingComic && (
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all font-bold text-sm bg-transparent ${
                darkMode
                  ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }`}
              title="Import JSON"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={onUploadJSON}
                className="hidden"
              />
            </label>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Judul (8 Kolom di Desktop) */}
            <div className="md:col-span-8">
              <label
                className={`block mb-2 font-bold ${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Judul Komik
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-green-500/50 bg-black/50 text-green-400 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/30"
                    : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                } outline-none transition-all`}
                placeholder="Contoh: Solo Leveling..."
                required
              />
            </div>

            {/* Episode (4 Kolom di Desktop) */}
            <div className="md:col-span-4">
              <label
                className={`block mb-2 font-bold ${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Episode Terakhir
              </label>
              <input
                type="number"
                value={formData.episode}
                onChange={(e) =>
                  setFormData({ ...formData, episode: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-green-500/50 bg-black/50 text-green-400 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/30"
                    : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                } outline-none transition-all`}
                placeholder="Contoh: 120"
                required
              />
            </div>

            {/* Link (Full Width 12 Kolom) */}
            <div className="md:col-span-12">
              <label
                className={`block mb-2 font-bold ${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Link URL Komik
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-green-500/50 bg-black/50 text-green-400 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/30"
                    : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                } outline-none transition-all`}
                placeholder="https://..."
                required
              />
            </div>
            
          </div>

          {/* ⬇️ NSFW CHECKBOX ⬇️ */}
          <div
            className={`p-4 rounded-lg border-2 ${
              darkMode
                ? "border-red-500/50 bg-red-500/10"
                : "border-red-300 bg-red-50"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNSFW}
                onChange={(e) =>
                  setFormData({ ...formData, isNSFW: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-red-500 text-red-500 focus:ring-2 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <div
                  className={`font-bold ${darkMode ? "text-red-400" : "text-red-700"}`}
                >
                  🔞 NSFW Content (18+)
                </div>
                <div
                  className={`text-sm ${darkMode ? "text-red-300" : "text-red-600"}`}
                >
                  Komik ini hanya akan terlihat oleh user yang login
                </div>
              </div>
            </label>
          </div>

          {/* Buttons Area */}
          <div className={`flex flex-col sm:flex-row gap-4 pt-8 mt-6 border-t-2 ${darkMode ? "border-green-500/20" : "border-gray-200"}`}>
            <button
              type="submit"
              className={`w-full sm:flex-1 py-4 flex items-center justify-center gap-2 rounded-xl border-2 font-bold text-lg transition-all ${
                darkMode
                  ? "border-green-500 bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/30"
                  : "border-green-600 bg-green-600 text-white hover:bg-green-700 shadow-md"
              }`}
            >
              {editingComic ? "💾 Simpan Perubahan" : "➕ Tambah Komik"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 rounded-xl border-2 font-bold transition-all ${
                darkMode
                  ? "border-green-500/50 text-green-400 hover:border-green-400 hover:bg-green-500/10"
                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100"
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
