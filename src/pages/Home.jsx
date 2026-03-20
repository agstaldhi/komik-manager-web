import { useMemo } from "react"; // ⬅️ Import useMemo
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export const Home = ({ comics }) => {
  const { darkMode } = useTheme();
  const { isGuest } = useAuth();

  // ⬇️ Use useMemo untuk prevent re-calculation
  const sortedComics = useMemo(() => {
    return [...comics].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB - dateA;
    });
  }, [comics]);

  const latestComic = sortedComics.length > 0 ? sortedComics[0] : null;
  // Memperpanjang history dari 5 menjadi 12 karena memanfaatkan Full Grid Layout
  const recentComics = sortedComics.slice(0, 12);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Format tanggal tidak valid";
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full space-y-6"
    >
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome & Featured Block (Spans 2 cols) */}
        <div className={`col-span-1 lg:col-span-2 border-2 ${darkMode ? "border-green-500 bg-black/30" : "border-gray-300 bg-white"} rounded-2xl p-6 sm:p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group`}>
          <div className="relative z-10 w-full">
            <h2 className={`text-4xl sm:text-5xl font-black mb-3 ${darkMode ? "text-green-400" : "text-gray-800"}`}>
              Personal Comic Manager
            </h2>
            <p className={`text-lg mb-6 max-w-lg ${darkMode ? "text-green-300/80" : "text-gray-600"}`}>
              Sistem manajemen koleksi komik pribadi Anda. Pantau kemajuan bacaan dengan cepat, kapanpun dan di manapun.
            </p>
            
            {latestComic && (
              <div className={`inline-block w-full sm:w-auto p-5 rounded-xl border-2 transition-all ${darkMode ? "border-green-500/50 bg-black/50 hover:bg-green-500/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-green-500" : "text-green-600"}`}>
                  🔥 Terakhir Diperbarui
                </div>
                <a
                  href={latestComic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl font-bold hover:underline mb-1 break-words block ${darkMode ? "text-green-300 hover:text-green-400" : "text-green-700 hover:text-green-600"}`}
                >
                  {latestComic.title}
                  {latestComic.isNSFW && (
                    <span className="ml-3 px-2 py-0.5 text-xs font-black align-middle rounded bg-red-500 text-white">18+</span>
                  )}
                </a>
                <div className={`text-sm font-semibold mt-2 ${darkMode ? "text-green-400" : "text-gray-700"}`}>
                  <span className="opacity-70">Episode</span> {latestComic.episode} <span className="opacity-50 mx-2">•</span> <span className="opacity-70">{formatDate(latestComic.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>
          {/* Decorative Background Element */}
          <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
             <svg className="w-80 h-80 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
          </div>
        </div>

        {/* Counter Block (Spans 1 col) */}
        <div className={`border-2 ${darkMode ? "border-green-500 bg-black/30" : "border-gray-300 bg-white"} rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-lg text-center`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"}`}>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div className={`text-7xl font-black mb-3 ${darkMode ? "text-green-400" : "text-gray-800"}`}>
            {comics.length}
          </div>
          <div className={`text-sm font-bold uppercase tracking-widest ${darkMode ? "text-green-500" : "text-gray-500"}`}>
            Total Koleksi
          </div>
        </div>

      </div>

      {/* Grid Riwayat Terbaru */}
      {recentComics.length > 0 && (
        <div className={`border-2 ${darkMode ? "border-green-500/30 bg-black/20" : "border-gray-200 bg-white"} rounded-2xl p-6 sm:p-8 shadow-md`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${darkMode ? "text-green-400" : "text-gray-800"}`}>
            <span className="text-3xl">📚</span> Riwayat Tambahan Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {recentComics.map((comic, idx) => (
              <motion.div
                key={comic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="h-full"
              >
                <a
                  href={comic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-5 py-6 rounded-xl border-2 h-full flex flex-col justify-between group transition-all duration-300 ${
                    darkMode
                      ? "border-green-500/30 bg-black/40 hover:border-green-400 hover:bg-green-500/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
                      : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-green-600/10"
                  }`}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`font-bold text-lg leading-snug group-hover:underline break-words ${darkMode ? "text-green-300" : "text-green-700"}`} style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {comic.title}
                      </div>
                      {comic.isNSFW && (
                        <span className={`shrink-0 px-2 py-1 text-[10px] uppercase font-black tracking-wider rounded ${darkMode ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-red-500 text-white"}`}>18+</span>
                      )}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
                      Episode {comic.episode}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between text-xs mt-auto pt-4 border-t-2 ${darkMode ? "border-green-500/20 text-green-300/70" : "border-gray-200 text-gray-500"}`}>
                    <span>{formatDate(comic.updatedAt)}</span>
                    <span className={`text-xl transform outline-none transition-transform duration-300 group-hover:translate-x-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                      →
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
