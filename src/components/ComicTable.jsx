import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { ArrowUpDown, Edit3, Trash2 } from "lucide-react";

export const ComicTable = ({ comics, loading, onEdit, onDelete, canEdit, sortConfig, onSort }) => {
  const { darkMode } = useTheme();

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-zinc-200/50 dark:border-zinc-800/80 text-zinc-400 dark:text-zinc-500">
            {/* Title Column */}
            <th 
              className="px-4 py-3 text-left w-[75%] sm:w-[80%] cursor-pointer select-none transition-colors hover:text-emerald-500 font-bold uppercase tracking-wider"
              onClick={() => onSort && onSort('title')}
            >
              <div className="flex items-center gap-1.5">
                <span>Comic Title</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortConfig?.key === 'title' && (
                  <span className="text-emerald-500 font-extrabold text-[10px]">
                    {sortConfig.direction === 'asc' ? 'ASC' : 'DESC'}
                  </span>
                )}
              </div>
            </th>

            {/* Episode Column */}
            <th 
              className="px-4 py-3 text-center w-[25%] sm:w-[20%] cursor-pointer select-none transition-colors hover:text-emerald-500 font-bold uppercase tracking-wider"
              onClick={() => onSort && onSort('episode')}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>Episode</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortConfig?.key === 'episode' && (
                  <span className="text-emerald-500 font-extrabold text-[10px]">
                    {sortConfig.direction === 'asc' ? 'ASC' : 'DESC'}
                  </span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr
                key={`table-skeleton-${idx}`}
                className="border-b border-zinc-100 dark:border-zinc-900/60 animate-pulse"
              >
                {/* Title & Cover Skeleton */}
                <td className="px-4 py-3.5 align-middle">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 sm:w-14 sm:h-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex-shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    </div>
                  </div>
                </td>
                {/* Episode Skeleton */}
                <td className="px-4 py-3.5 text-center align-middle">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-8 mx-auto" />
                </td>
              </tr>
            ))
          ) : (
            comics.map((comic, idx) => (
              <motion.tr
                key={comic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.4), duration: 0.3 }}
                className="border-b border-zinc-100 dark:border-zinc-900/60 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/30 transition-all duration-200"
              >
                {/* Title & Cover */}
                <td className="px-4 py-3.5 align-middle">
                  <div className="flex items-center gap-4">
                    {comic.thumbnail ? (
                      <img
                        src={comic.thumbnail}
                        alt={comic.title}
                        className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg shadow-md flex-shrink-0 border border-zinc-100 dark:border-zinc-900"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col items-center justify-center text-lg flex-shrink-0">
                        📖
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {comic.isNSFW && (
                          <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] uppercase font-black tracking-wider rounded bg-red-500 text-white flex-shrink-0">
                            18+
                          </span>
                        )}
                        <a
                          href={comic.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-100 break-words whitespace-normal leading-snug hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                          style={{ wordBreak: 'break-word' }}
                        >
                          {comic.title}
                        </a>
                      </div>
                      
                      {comic.alternativeTitles && comic.alternativeTitles.length > 0 && (
                        <div className="text-[10px] sm:text-xs italic text-zinc-400 dark:text-zinc-500 mt-1 leading-tight break-words">
                          {comic.alternativeTitles.join(" • ")}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Episode & Actions */}
                <td className="px-4 py-3.5 text-center align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                      {comic.episode}
                    </span>
                    
                    {canEdit && (
                      <div className="flex flex-col gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(comic)}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-zinc-500 hover:text-emerald-500 transition-all outline-none bg-white/50 dark:bg-zinc-900/40 shadow-sm"
                          title="Edit Comic"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(comic)}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 text-zinc-500 hover:text-red-500 transition-all outline-none bg-white/50 dark:bg-zinc-900/40 shadow-sm"
                          title="Delete Comic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
