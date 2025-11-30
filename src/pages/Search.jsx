import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const Search = ({ comics, initialQuery = "" }) => {
  // ⭐ Tambah initialQuery
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialQuery); // ⭐ Set dari prop

  // ⭐ TAMBAHKAN: Update saat initialQuery berubah
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const filteredComics = comics.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className={
            darkMode
              ? "bg-green-500 text-black font-bold px-1 rounded"
              : "bg-yellow-300 text-black font-bold px-1 rounded"
          }
        >
          {part}
        </span>
      ) : (
        part
      )
    );
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
    >
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full px-6 py-4 rounded-lg border-2 text-lg ${
            darkMode
              ? "border-green-500 bg-black text-green-400 focus:shadow-lg focus:shadow-green-500/50"
              : "border-gray-300 bg-white text-gray-800 focus:border-green-500"
          } outline-none transition-all`}
          placeholder="🔍 Cari komik..."
        />
      </div>

      <div className="grid gap-4">
        {filteredComics.map((comic, idx) => (
          <motion.div
            key={comic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-6 rounded-lg border-2 ${
              darkMode
                ? "border-green-500/50 bg-black/30 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
                : "border-gray-300 bg-white hover:border-green-500"
            } transition-all`}
          >
            <a
              href={comic.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl font-bold hover:underline block mb-2 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {highlightText(comic.title, searchQuery)}
            </a>
            <div className={darkMode ? "text-green-300" : "text-gray-700"}>
              Episode: {comic.episode}
            </div>
          </motion.div>
        ))}
        {filteredComics.length === 0 && (
          <div
            className={`text-center py-12 ${
              darkMode ? "text-green-300" : "text-gray-600"
            }`}
          >
            {searchQuery
              ? "Tidak ada komik ditemukan"
              : "Ketik untuk mencari komik..."}
          </div>
        )}
      </div>
    </motion.div>
  );
};
