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
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.alternativeTitles || []).some((alt) =>
      alt.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
            className={`p-4 rounded-lg border-2 flex gap-4 items-start ${
              darkMode
                ? "border-green-500/50 bg-black/30 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
                : "border-gray-300 bg-white hover:border-green-500"
            } transition-all`}
          >
            {comic.thumbnail ? (
              <img
                src={comic.thumbnail}
                alt={comic.title}
                className={`w-14 h-20 sm:w-16 sm:h-24 object-cover rounded-lg border-2 ${
                  darkMode ? "border-green-500/30 shadow-green-500/10" : "border-gray-300"
                } shadow-md flex-shrink-0`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div
                className={`w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 border-dashed flex-shrink-0 flex flex-col items-center justify-center shadow-inner ${
                  darkMode
                    ? "border-green-500/20 bg-green-500/5 text-green-400/40"
                    : "border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                <span className="text-xl">📖</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <a
                href={comic.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xl sm:text-2xl font-bold hover:underline block break-words whitespace-normal leading-snug mb-1 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {highlightText(comic.title || "", searchQuery)}
                {comic.isNSFW && (
                  <span className="inline-block ml-2 px-1.5 py-0.5 text-xs font-black align-middle rounded bg-red-500 text-white">
                    18+
                  </span>
                )}
              </a>
              {comic.alternativeTitles && comic.alternativeTitles.length > 0 && (
                <div
                  className={`text-xs sm:text-sm italic mt-1 leading-tight break-words mb-2 ${
                    darkMode ? "text-green-400/50" : "text-gray-500"
                  }`}
                >
                  {highlightText(
                    comic.alternativeTitles.join(" • "),
                    searchQuery
                  )}
                </div>
              )}
              <div className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
                Episode: {comic.episode}
              </div>
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
