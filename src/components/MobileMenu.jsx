import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

export const MobileMenu = ({ currentPage, onPageChange }) => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "list", label: "List", icon: "📋" },
    { id: "add", label: "Add", icon: "➕" },
  ];

  // Disable body scroll saat menu terbuka
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";

      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      const scrollY = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.overflowX = "";

      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";

      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.overflowX = "";

      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [isOpen]);

  const handleMenuClick = (page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-lg border-2 ${
          darkMode
            ? "bg-black border-green-500 text-green-400 hover:bg-green-500/10"
            : "bg-white border-gray-400 text-gray-700 hover:bg-gray-50"
        } shadow-lg transition-all`}
        aria-label="Menu"
        style={{ position: "relative", zIndex: 9999 }}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className={`w-full h-0.5 ${
              darkMode ? "bg-green-400" : "bg-gray-700"
            } rounded transition-all`}
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`w-full h-0.5 ${
              darkMode ? "bg-green-400" : "bg-gray-700"
            } rounded transition-all`}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className={`w-full h-0.5 ${
              darkMode ? "bg-green-400" : "bg-gray-700"
            } rounded transition-all`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9990,
          }}
        >
          <AnimatePresence>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 9991,
                touchAction: "none",
                overscrollBehavior: "none",
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${
                darkMode
                  ? "bg-black border-l-2 border-green-500"
                  : "bg-white border-l-2 border-gray-300"
              } shadow-2xl overflow-y-auto`}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "320px",
                maxWidth: "85vw",
                height: "100vh",
                zIndex: 9992,
                touchAction: "pan-y",
                overscrollBehavior: "contain",
              }}
            >
              <div className="p-6 min-h-full flex flex-col">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-2xl font-bold ${
                      darkMode ? "text-green-400" : "text-gray-800"
                    }`}
                  >
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg border-2 ${
                      darkMode
                        ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    } transition-all`}
                    aria-label="Close Menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2 mb-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        currentPage === item.id
                          ? darkMode
                            ? "bg-green-500 border-green-500 text-black font-bold shadow-lg shadow-green-500/50"
                            : "bg-green-600 border-green-600 text-white font-bold"
                          : darkMode
                          ? "border-green-500/30 text-green-400 hover:border-green-500 hover:bg-green-500/10"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-lg">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Divider */}
                <div
                  className={`border-t ${
                    darkMode ? "border-green-500/30" : "border-gray-300"
                  } my-4`}
                />

                {/* Theme Toggle */}
                <div className="mb-4">
                  <ThemeToggle />
                </div>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Info Footer */}
                <div
                  className={`mt-auto p-4 rounded-lg border ${
                    darkMode
                      ? "border-green-500/30 bg-black/50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-green-300" : "text-gray-600"
                    }`}
                  >
                    💡 Tip: Gunakan fitur search di halaman List untuk mencari
                    komik!
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
