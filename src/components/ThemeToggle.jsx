import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
        darkMode
          ? "border-green-500/30 hover:border-green-500 hover:bg-green-500/10 text-green-400"
          : "border-gray-300 hover:bg-gray-100 text-gray-700"
      }`}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 360 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-2xl flex items-center justify-center"
      >
        {darkMode ? "🌙" : "☀️"}
      </motion.div>
    </button>
  );
};
