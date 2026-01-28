import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ⬅️ Import useAuth
import { ComicTable } from "../components/ComicTable";

export const List = ({ comics, onEdit, onDelete, onUploadJSON, canEdit }) => {
  const { darkMode } = useTheme();
  const { showNSFW } = useAuth(); // ⬅️ Get showNSFW untuk filter
  const [searchQuery, setSearchQuery] = useState("");

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // ⬇️ Filter comics: search + NSFW filter
  const filteredComics = comics.filter((comic) => {
    const matchSearch = comic.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchNSFW = showNSFW || !comic.isNSFW; // Jika guest, hide NSFW
    return matchSearch && matchNSFW;
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Guest Mode Warning */}
      {!canEdit && (
        <div
          className={`mb-4 p-4 rounded-lg border-2 ${
            darkMode
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-yellow-600 bg-yellow-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div
                className={`font-bold ${darkMode ? "text-yellow-400" : "text-yellow-700"}`}
              >
                Guest Mode - View Only
              </div>
              <div
                className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}
              >
                You cannot add, edit, or delete comics. NSFW content is hidden.
                Login with Google for full access.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON - Only for authenticated users */}
      {canEdit && (
        <div className="mb-4">
          <label
            className={`block mb-2 ${darkMode ? "text-green-400" : "text-gray-700"} font-bold`}
          >
            📤 Import JSON
          </label>
          <input
            type="file"
            accept=".json"
            onChange={onUploadJSON}
            className={`w-full px-4 py-2 rounded-lg border-2 ${
              darkMode
                ? "border-green-500 bg-black text-green-400"
                : "border-gray-300 bg-white text-gray-800"
            } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 ${
              darkMode
                ? "file:bg-green-500 file:text-black hover:file:bg-green-400"
                : "file:bg-green-600 file:text-white hover:file:bg-green-700"
            } file:cursor-pointer cursor-pointer`}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <label
          className={`block mb-2 ${darkMode ? "text-green-400" : "text-gray-700"} font-bold`}
        >
          🔍 Search Comics
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari komik berdasarkan judul..."
          className={`w-full px-4 py-3 rounded-lg border-2 text-lg ${
            darkMode
              ? "border-green-500 bg-black text-green-400 placeholder-green-600 focus:shadow-lg focus:shadow-green-500/50"
              : "border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-green-500"
          } outline-none transition-all`}
        />
        {searchQuery && (
          <p
            className={`text-sm mt-2 ${darkMode ? "text-green-300" : "text-gray-600"}`}
          >
            Menampilkan {filteredComics.length} dari {comics.length} komik
          </p>
        )}
      </div>

      {/* Comic Table */}
      {filteredComics.length > 0 ? (
        <ComicTable
          comics={filteredComics}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ) : (
        <div
          className={`text-center py-12 border-2 rounded-lg ${
            darkMode
              ? "border-green-500/30 bg-black/30"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <div className={`text-6xl mb-4`}>🔍</div>
          <p
            className={`text-xl ${darkMode ? "text-green-300" : "text-gray-600"}`}
          >
            {searchQuery
              ? `Tidak ada komik dengan judul "${searchQuery}"`
              : "Belum ada komik"}
          </p>
        </div>
      )}
    </motion.div>
  );
};
