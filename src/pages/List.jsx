import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ⬅️ Import useAuth
import { ComicTable } from "../components/ComicTable";

export const List = ({
  comics,
  onEdit,
  onDelete,
  canEdit,
  currentPage: propCurrentPage,
  setCurrentPage: propSetCurrentPage,
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
  nsfwFilter: propNsfwFilter,
  setNsfwFilter: propSetNsfwFilter,
  sortConfig: propSortConfig,
  setSortConfig: propSetSortConfig,
}) => {
  const { darkMode } = useTheme();

  // Local fallback states if props are not provided
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localNsfwFilter, setLocalNsfwFilter] = useState("all");
  const [localSortConfig, setLocalSortConfig] = useState({ key: null, direction: 'asc' });

  // Map to props or fallback to local state
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propSetSearchQuery !== undefined ? propSetSearchQuery : setLocalSearchQuery;
  const currentPage = propCurrentPage !== undefined ? propCurrentPage : localCurrentPage;
  const setCurrentPage = propSetCurrentPage !== undefined ? propSetCurrentPage : setLocalCurrentPage;
  const nsfwFilter = propNsfwFilter !== undefined ? propNsfwFilter : localNsfwFilter;
  const setNsfwFilter = propSetNsfwFilter !== undefined ? propSetNsfwFilter : setLocalNsfwFilter;
  const sortConfig = propSortConfig !== undefined ? propSortConfig : localSortConfig;
  const setSortConfig = propSetSortConfig !== undefined ? propSetSortConfig : setLocalSortConfig;

  const itemsPerPage = 20;

  const [pageInput, setPageInput] = useState(currentPage.toString());

  // Keep input field value in sync with currentPage
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Auto scroll to top of window when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset page on sort
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // ⬇️ Filter comics: search and local NSFW filter
  const filteredComics = useMemo(() => {
    let filtered = comics.filter((comic) => {
      const matchesSearch = comic.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      if (nsfwFilter === "safe" && comic.isNSFW) return false;
      if (nsfwFilter === "nsfw" && !comic.isNSFW) return false;
      
      return true;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'title') {
          return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortConfig.key === 'episode') {
          return sortConfig.direction === 'asc'
            ? a.episode - b.episode
            : b.episode - a.episode;
        }
        return 0;
      });
    }

    return filtered;
  }, [comics, searchQuery, nsfwFilter, sortConfig]);

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



      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            className={`block ${darkMode ? "text-green-400" : "text-gray-700"} font-bold`}
          >
            🔍 Search Comics
          </label>
          {canEdit && (
            <div className="flex gap-1">
              {['all', 'safe', 'nsfw'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setNsfwFilter(filter); setCurrentPage(1); }}
                  className={`px-3 py-1 text-xs font-bold rounded-full border-2 transition-all ${
                    nsfwFilter === filter
                      ? filter === 'nsfw'
                        ? 'border-red-500 bg-red-500 text-white shadow-sm shadow-red-500/50'
                        : darkMode
                        ? 'border-green-500 bg-green-500 text-black shadow-sm shadow-green-500/50'
                        : 'border-green-600 bg-green-600 text-white shadow-sm shadow-green-600/50'
                      : darkMode
                      ? 'border-green-500/30 text-green-400 hover:bg-green-500/20'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'safe' ? 'Safe' : '18+'}
                </button>
              ))}
            </div>
          )}
        </div>
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
            sortConfig={sortConfig}
            onSort={handleSort}
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
                <div className="flex items-center gap-1 text-sm mx-2">
                  <span className={darkMode ? "text-green-400" : "text-gray-600"}>Lompat ke:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageInput(val);
                      const num = parseInt(val, 10);
                      if (num >= 1 && num <= totalPages) {
                        setCurrentPage(num);
                      }
                    }}
                    className={`w-14 px-2 py-1 text-center font-bold rounded border-2 ${
                      darkMode
                        ? "border-green-500 bg-black text-green-400 focus:border-green-400"
                        : "border-gray-300 bg-white text-gray-800 focus:border-green-500"
                    } outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />
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
