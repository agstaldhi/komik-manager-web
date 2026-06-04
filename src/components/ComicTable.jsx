import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const ComicTable = ({ comics, onEdit, onDelete, canEdit, sortConfig, onSort }) => {
  const { darkMode } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full table-fixed border-2 ${
          darkMode ? "border-green-500" : "border-gray-300"
        } rounded-lg overflow-hidden text-sm sm:text-base`}
      >
        <thead
          className={
            darkMode ? "bg-green-500 text-black" : "bg-gray-200 text-gray-800"
          }
        >
          <tr>
            <th 
              className={`px-2 py-2 sm:px-4 sm:py-3 text-left w-[50%] sm:w-[60%] cursor-pointer select-none transition-colors ${darkMode ? "hover:bg-green-600" : "hover:bg-gray-300"}`}
              onClick={() => onSort && onSort('title')}
            >
              <div className="flex items-center gap-1">
                <span>Judul</span>
                <span className="inline-flex justify-center flex-shrink-0 w-3 sm:w-4">
                  {sortConfig?.key === 'title' ? (
                    <span className="text-[10px] sm:text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  ) : (
                    <span className="opacity-30 text-[10px] sm:text-xs">↕</span>
                  )}
                </span>
              </div>
            </th>
            <th 
              className={`px-2 py-2 sm:px-4 sm:py-3 text-center w-[20%] sm:w-[20%] cursor-pointer select-none transition-colors ${darkMode ? "hover:bg-green-600" : "hover:bg-gray-300"}`}
              onClick={() => onSort && onSort('episode')}
            >
              <div className="flex items-center justify-center gap-1 w-full relative">
                <span className="inline-block relative">
                  Eps
                  <span className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 inline-flex justify-center flex-shrink-0 w-3 sm:w-4">
                    {sortConfig?.key === 'episode' ? (
                      <span className="text-[10px] sm:text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    ) : (
                      <span className="opacity-30 text-[10px] sm:text-xs">↕</span>
                    )}
                  </span>
                </span>
              </div>
            </th>
            {canEdit && <th className="px-2 py-2 sm:px-4 sm:py-3 text-left w-[30%] sm:w-[20%]">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {comics.map((comic, idx) => (
            <motion.tr
              key={comic.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`border-t-2 ${
                darkMode
                  ? "border-green-500/30 hover:bg-green-500/10"
                  : "border-gray-200 hover:bg-gray-50"
              } transition-colors`}
            >
              <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                <div className="flex items-center">
                  {comic.thumbnail ? (
                    <img
                      src={comic.thumbnail}
                      alt={comic.title}
                      className={`w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg border-2 ${
                        darkMode ? "border-green-500/30 shadow-green-500/10" : "border-gray-300"
                      } shadow-md flex-shrink-0 mr-3`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                      }}
                    />
                  ) : (
                    <div
                      className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed flex-shrink-0 mr-3 flex flex-col items-center justify-center shadow-inner ${
                        darkMode
                          ? "border-green-500/20 bg-green-500/5 text-green-400/50"
                          : "border-gray-300 bg-gray-50 text-gray-400"
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">📖</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <a
                      href={comic.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline font-bold block break-words whitespace-normal leading-snug ${
                        darkMode
                          ? "text-green-300 hover:text-green-200"
                          : "text-green-700 hover:text-green-800"
                      }`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {(comic.title || "").split("|")[0].trim()}
                      {comic.isNSFW && (
                        <span className="inline-block ml-2 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider rounded bg-red-500 text-white align-middle">
                          18+
                        </span>
                      )}
                    </a>
                    {(comic.title || "").split("|").slice(1).length > 0 && (
                      <div
                        className={`text-[11px] sm:text-xs italic mt-1 leading-tight break-words ${
                          darkMode ? "text-green-400/50" : "text-gray-500"
                        }`}
                      >
                        {(comic.title || "").split("|").slice(1).map(t => t.trim()).join(" • ")}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-3 text-center align-middle">{comic.episode}</td>
              {canEdit && (
                <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                  <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                    <button
                      onClick={() => onEdit(comic)}
                      className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base rounded border-2 transition-all ${
                        darkMode
                          ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                          : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comic)}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base rounded border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
