import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ⬅️ Import useAuth
import { ComicTable } from "../components/ComicTable";

export const List = ({ comics, onEdit, onDelete, onUploadJSON, canEdit }) => {
  const { darkMode } = useTheme();
  // We can remove showNSFW from useAuth here since useComics already filtered it based on showNSFW.
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // ⬇️ Filter comics: search (NSFW filter is already handled by useComics)
  const filteredComics = useMemo(() => {
    return comics.filter((comic) =>
      comic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [comics, searchQuery]);

  const totalPages = Math.ceil(filteredComics.length / itemsPerPage);
  
  const paginatedComics = useMemo(() => {
    return filteredComics.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredComics, currentPage]);

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
                You cannot add, edit, or delete comics. Some content is hidden.
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
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
        <>
          <ComicTable
            comics={paginatedComics}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
          />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2">
              <span className={`text-sm ${darkMode ? "text-green-400" : "text-gray-600"} mb-4 sm:mb-0`}>
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 flex items-center gap-1 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                <div className="flex gap-1">
                  {/* Quick page numbers logic can be added here if needed, keeping it simple for now */}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 flex items-center gap-1 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
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
