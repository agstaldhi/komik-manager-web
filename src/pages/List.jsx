import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ComicTable } from "../components/ComicTable";
import { AddEdit } from "./AddEdit";

export const List = ({
  comics,
  onSaveComic,
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
  
  // Modal state for Add/Edit Comic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComic, setEditingComic] = useState(null);

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

  const handleOpenAddModal = () => {
    setEditingComic(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (comic) => {
    setEditingComic(comic);
    setIsModalOpen(true);
  };

  const handleSaveAndClose = async (formData) => {
    await onSaveComic(editingComic, formData);
    setIsModalOpen(false);
    setEditingComic(null);
  };

  // Filter comics: search and local NSFW filter
  const filteredComics = useMemo(() => {
    let filtered = comics.filter((comic) => {
      const matchesSearch = (comic.title || "").toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalPages = Math.ceil(filteredComics.length / itemsPerPage) || 1;
  
  const paginatedComics = useMemo(() => {
    return filteredComics.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredComics, currentPage]);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Guest Mode Warning Banner */}
      {!canEdit && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm text-amber-600 dark:text-amber-400">
                Guest Mode — View Only
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                You cannot add, edit, or delete comics. NSFW tagged comics are automatically hidden. Login with Google for full management.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Search, Filters, and Add Button */}
      <div className="p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Add Comics Button */}
          <div className="w-full sm:w-auto">
            {canEdit && (
              <button
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black font-extrabold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] select-none outline-none"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                <span>Add Comics+</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-900/60 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Show All' },
              { id: 'safe', label: 'Safe Only' },
              { id: 'nsfw', label: 'NSFW (18+)' }
            ].map((tab) => {
              // Hide NSFW filter for guests since they can't view NSFW anyway
              if (tab.id === 'nsfw' && !canEdit) return null;
              
              const isSelected = nsfwFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setNsfwFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all select-none outline-none whitespace-nowrap ${
                    isSelected
                      ? tab.id === 'nsfw'
                        ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                        : "bg-emerald-500 dark:bg-emerald-500 text-white dark:text-black shadow-md shadow-emerald-500/20"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search comics by title..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white dark:focus:bg-zinc-950 outline-none transition-all"
          />
        </div>

        {searchQuery && (
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 pl-1">
            Found {filteredComics.length} of {comics.length} comics matching search
          </div>
        )}
      </div>

      {/* Comics Table Container */}
      <div className="p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md">
        {filteredComics.length > 0 ? (
          <>
            <ComicTable
              comics={paginatedComics}
              onEdit={handleOpenEditModal}
              onDelete={onDelete}
              canEdit={canEdit}
              sortConfig={sortConfig}
              onSort={handleSort}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-950 gap-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center gap-3">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300 transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  {/* Page Jumper Input */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    <span>Go to:</span>
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
                      className="w-12 px-2 py-1.5 text-center font-extrabold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-800 dark:text-zinc-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300 transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">📖</span>
            <p className="text-base font-bold text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? `No comics match search term "${searchQuery}"`
                : "No comics inside the database."}
            </p>
          </div>
        )}
      </div>

      {/* Glassmorphic Add/Edit Comic Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl relative z-10 p-1 pointer-events-auto"
            >
              <AddEdit
                editingComic={editingComic}
                onSave={handleSaveAndClose}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingComic(null);
                }}
                isModal={true}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
