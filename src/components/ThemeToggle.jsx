import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
        darkMode
          ? "border-green-500/30 hover:border-green-500 hover:bg-green-500/10 text-green-400"
          : "border-green-600/30 hover:border-green-600 hover:bg-green-600/10 text-green-700"
      }`}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 360 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-lg sm:text-xl flex items-center justify-center"
      >
        {darkMode ? "🌙" : "☀️"}
      </motion.div>
    </button>
  );
};
