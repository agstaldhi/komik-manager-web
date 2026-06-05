import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Plus, Trash2, X } from "lucide-react";

export const AddEdit = ({ editingComic, onSave, onCancel, isModal = false }) => {
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

  return (
    <div className={`w-full p-6 sm:p-8 ${darkMode ? "text-zinc-50" : "text-zinc-900"}`}>
      {/* Title & Close Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-900">
        <h2 className="text-2xl font-black tracking-tight">
          {editingComic ? "✏️ Edit Comic" : "➕ Add Comic"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Judul Komik (8 Cols) */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <label className="block mb-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Comic Title
              </label>
              <input
                type="text"
                value={formData.mainTitle}
                onChange={(e) =>
                  setFormData({ ...formData, mainTitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Solo Leveling"
                required
              />
            </div>
            
            {/* Alt Titles List */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Alternative Titles
              </label>
              
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
                    className="flex-1 px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    placeholder={`Alternative Title #${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newAltTitles = formData.altTitles.filter((_, i) => i !== index);
                      setFormData({ ...formData, altTitles: newAltTitles });
                    }}
                    className="p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all outline-none"
                    title="Remove title"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, altTitles: [...formData.altTitles, ""] });
                }}
                className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Alternative Title</span>
              </button>
            </div>
          </div>

          {/* Episode (4 Cols) */}
          <div className="md:col-span-4">
            <label className="block mb-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Last Read Episode
            </label>
            <input
              type="number"
              value={formData.episode}
              onChange={(e) =>
                setFormData({ ...formData, episode: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. 120"
              required
            />
          </div>

          {/* Link URL (Full Width) */}
          <div className="md:col-span-12">
            <label className="block mb-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Comic URL Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              placeholder="https://..."
              required
            />
          </div>

          {/* Link Thumbnail (8 Cols) */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <label className="block mb-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Cover Image URL (Thumbnail)
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                placeholder="https://..."
              />
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-2 block">
                Leave empty to use a default cover book placeholder.
              </span>
            </div>
          </div>

          {/* Preview Thumbnail (4 Cols) */}
          <div className="md:col-span-4 flex flex-col justify-end">
            <label className="block mb-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Cover Preview
            </label>
            <div
              className={`h-[140px] w-[100px] rounded-2xl border border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${
                formData.thumbnail
                  ? "border-emerald-500/50 shadow-md shadow-emerald-500/5 bg-zinc-50 dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-400"
              }`}
            >
              {formData.thumbnail ? (
                <img
                  src={formData.thumbnail}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
              ) : (
                <div className="text-center p-2 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-1">📖</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">No Cover</span>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* NSFW (18+) Checkbox Block */}
        <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 backdrop-blur-sm">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isNSFW}
              onChange={(e) =>
                setFormData({ ...formData, isNSFW: e.target.checked })
              }
              className="w-5 h-5 rounded border border-red-500 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <div>
              <div className="font-extrabold text-sm text-red-500 dark:text-red-400">
                🔞 NSFW Content (18+)
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Mark this comic as containing mature content. It will be hidden from guest users.
              </div>
            </div>
          </label>
        </div>

        {/* Form Submission Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="submit"
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black font-extrabold text-base transition-all select-none outline-none hover:shadow-lg hover:shadow-emerald-500/15 active:scale-[0.98]"
          >
            {editingComic ? "Simpan Perubahan" : "Tambah Komik"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 font-bold text-zinc-600 dark:text-zinc-300 transition-all select-none outline-none active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
