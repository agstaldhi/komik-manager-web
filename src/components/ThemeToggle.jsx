import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 transition-all ${
        darkMode
          ? "border-green-500/30 hover:border-green-500 hover:bg-green-500/10"
          : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      {/* Label */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{darkMode ? "🌙" : "☀️"}</span>
        <span
          className={`text-lg font-medium ${
            darkMode ? "text-green-400" : "text-gray-700"
          }`}
        >
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>
      </div>

      {/* Toggle Switch */}
      <div
        className={`relative w-16 h-8 rounded-full transition-colors ${
          darkMode ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 ${
            darkMode ? "left-9" : "left-1"
          } w-6 h-6 rounded-full ${
            darkMode ? "bg-black" : "bg-white"
          } shadow-lg flex items-center justify-center`}
        >
          <span className="text-xs">{darkMode ? "🌙" : "☀️"}</span>
        </motion.div>
      </div>
    </button>
  );
};
