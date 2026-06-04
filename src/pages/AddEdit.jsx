import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const AddEdit = ({ editingComic, onSave, onCancel, onUploadJSON }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    mainTitle: "",
    altTitles: [],
    episode: "",
    link: "",
    isNSFW: false,
    thumbnail: "",
  });

  useEffect(() => {
    if (editingComic) {
      const titleParts = (editingComic.title || "").split("|").map((t) => t.trim());
      const mainTitle = titleParts[0] || "";
      const altTitles = titleParts.slice(1);
      setFormData({
        mainTitle,
        altTitles,
        episode: editingComic.episode || "",
        link: editingComic.link || "",
        isNSFW: editingComic.isNSFW || false,
        thumbnail: editingComic.thumbnail || "",
      });
    } else {
      setFormData({
        mainTitle: "",
        altTitles: [],
        episode: "",
        link: "",
        isNSFW: false,
        thumbnail: "",
      });
    }
  }, [editingComic]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAltTitles = formData.altTitles
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const fullTitle = [formData.mainTitle.trim(), ...cleanAltTitles].join(" | ");

    onSave({
      title: fullTitle,
      episode: formData.episode,
      link: formData.link,
      isNSFW: formData.isNSFW,
      thumbnail: formData.thumbnail.trim(),
    });
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
                value={formData.mainTitle}
                onChange={(e) =>
                  setFormData({ ...formData, mainTitle: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-green-500/50 bg-black/50 text-green-400 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/30"
                    : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                } outline-none transition-all`}
                placeholder="Contoh: Solo Leveling..."
                required
              />
              
              {/* Alt Titles Input List */}
              <div className="mt-3 space-y-2">
                {formData.altTitles.map((altTitle, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={altTitle}
                      onChange={(e) => {
                        const newAltTitles = [...formData.altTitles];
                        newAltTitles[index] = e.target.value;
                        setFormData({ ...formData, altTitles: newAltTitles });
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl border-2 ${
                        darkMode
                          ? "border-green-500/30 bg-black/40 text-green-400 focus:border-green-400"
                          : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                      } outline-none transition-all text-sm`}
                      placeholder={`Judul Alternatif #${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newAltTitles = formData.altTitles.filter((_, i) => i !== index);
                        setFormData({ ...formData, altTitles: newAltTitles });
                      }}
                      className="p-2.5 rounded-xl border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Hapus judul alternatif"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {/* Tombol Add Alt Title */}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, altTitles: [...formData.altTitles, ""] });
                  }}
                  className={`px-3 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg border-2 transition-all ${
                    darkMode
                      ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Alt Title</span>
                </button>
              </div>
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

            {/* Link Thumbnail (8 Kolom di Desktop) */}
            <div className="md:col-span-8 col-span-1">
              <label
                className={`block mb-2 font-bold ${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Link URL Thumbnail (Cover)
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-green-500/50 bg-black/50 text-green-400 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/30"
                    : "border-gray-300 bg-gray-50 text-gray-800 focus:border-green-500 focus:bg-white"
                } outline-none transition-all`}
                placeholder="https://example.com/cover.jpg..."
              />
              <span className={`text-xs mt-1 block ${darkMode ? "text-green-500/60" : "text-gray-500"}`}>
                Kosongkan jika ingin menggunakan cover default/placeholder.
              </span>
            </div>

            {/* Preview Thumbnail (4 Kolom di Desktop) */}
            <div className="md:col-span-4 col-span-1 flex flex-col justify-end">
              <label
                className={`block mb-2 font-bold ${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Preview Cover
              </label>
              <div
                className={`h-[120px] w-[90px] rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  formData.thumbnail
                    ? "border-green-500/50 shadow-md shadow-green-500/10"
                    : darkMode
                    ? "border-green-500/20 bg-black/20 text-green-500/40"
                    : "border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt="Preview Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  <div className="text-center p-2 flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">📖</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">No Cover</span>
                  </div>
                )}
              </div>
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
