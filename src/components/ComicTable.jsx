import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export const ComicTable = ({ comics, onEdit, onDelete, canEdit }) => {
  const { darkMode } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-2 ${
          darkMode ? "border-green-500" : "border-gray-300"
        } rounded-lg overflow-hidden`}
      >
        <thead
          className={
            darkMode ? "bg-green-500 text-black" : "bg-gray-200 text-gray-800"
          }
        >
          <tr>
            <th className="px-4 py-3 text-left">Judul</th>
            <th className="px-4 py-3 text-left">Episode</th>
            {canEdit && <th className="px-4 py-3 text-left">Aksi</th>}
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
              <td className="px-4 py-3">
                <a
                  href={comic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline ${
                    darkMode
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                  }`}
                >
                  {comic.title}
                  {comic.isNSFW && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white">
                      18+
                    </span>
                  )}
                </a>
              </td>
              <td className="px-4 py-3">{comic.episode}</td>
              {canEdit && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(comic)}
                      className={`px-3 py-1 rounded border-2 transition-all ${
                        darkMode
                          ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                          : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comic)}
                      className="px-3 py-1 rounded border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
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
