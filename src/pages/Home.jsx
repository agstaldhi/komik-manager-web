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
  const recentComics = sortedComics.slice(0, 5);

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
      className="max-w-2xl mx-auto"
    >
      <div
        className={`border-2 ${darkMode ? "border-green-500 bg-black/30" : "border-gray-300 bg-white"} rounded-xl p-8 shadow-2xl ${darkMode && "shadow-green-500/20"}`}
      >
        <h2
          className={`text-4xl font-bold mb-8 ${darkMode ? "text-green-400" : "text-gray-800"}`}
        >
          Dashboard
        </h2>

        <div className="space-y-6">
          <div
            className={`p-6 rounded-lg border-2 ${darkMode ? "border-green-500/50 bg-black/50" : "border-gray-200 bg-gray-50"}`}
          >
            <div
              className={`text-sm ${darkMode ? "text-green-300" : "text-gray-600"} mb-2`}
            >
              Total Komik {isGuest}
            </div>
            <div
              className={`text-5xl font-bold ${darkMode ? "text-green-400" : "text-gray-800"}`}
            >
              {comics.length}
            </div>
          </div>

          {latestComic && (
            <div
              className={`p-6 rounded-lg border-2 ${darkMode ? "border-green-500/50 bg-black/50" : "border-gray-200 bg-gray-50"}`}
            >
              <div
                className={`text-sm ${darkMode ? "text-green-300" : "text-gray-600"} mb-3`}
              >
                Komik Terakhir Diperbarui
              </div>
              <a
                href={latestComic.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl font-bold hover:underline block mb-2 flex items-center gap-2 ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"}`}
              >
                {latestComic.title}
                {latestComic.isNSFW && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white">
                    18+
                  </span>
                )}
              </a>
              <div
                className={`text-lg ${darkMode ? "text-green-300" : "text-gray-700"}`}
              >
                Episode: {latestComic.episode}
              </div>
              <div
                className={`text-xs mt-2 ${darkMode ? "text-green-300/70" : "text-gray-500"}`}
              >
                Diperbarui: {formatDate(latestComic.updatedAt)}
              </div>
            </div>
          )}
        </div>

        {/* Recent Comics List */}
        {recentComics.length > 0 && (
          <div
            className={`mt-8 border-2 ${darkMode ? "border-green-500/50 bg-black/30" : "border-gray-200 bg-gray-50"} rounded-xl p-6`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${darkMode ? "text-green-400" : "text-gray-800"}`}
            >
              📚 Riwayat Terbaru
            </h3>
            <div className="space-y-3">
              {recentComics.map((comic, idx) => (
                <motion.div
                  key={comic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <a
                    href={comic.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 rounded-lg border-2 ${
                      darkMode
                        ? "border-green-500/30 bg-black/50 hover:border-green-500 hover:bg-green-500/10"
                        : "border-gray-300 bg-white hover:border-green-500 hover:bg-green-50"
                    } transition-all group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className={`font-bold text-lg mb-1 group-hover:underline flex items-center gap-2 ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          {comic.title}
                          {comic.isNSFW && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white">
                              18+
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-sm ${darkMode ? "text-green-300" : "text-gray-600"}`}
                        >
                          Episode {comic.episode}
                        </div>
                        <div
                          className={`text-xs mt-1 ${darkMode ? "text-green-300/70" : "text-gray-500"}`}
                        >
                          {formatDate(comic.updatedAt)}
                        </div>
                      </div>
                      <div
                        className={`text-2xl ${darkMode ? "text-green-500" : "text-green-600"} group-hover:translate-x-1 transition-transform`}
                      >
                        →
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
