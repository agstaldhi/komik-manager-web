import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export const Navbar = ({ currentPage, onPageChange }) => {
  const { darkMode } = useTheme();
  const pages = ["home", "list", "add"]; // Hapus 'search'

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`border-b-2 ${
          darkMode ? "border-green-500 bg-black/50" : "border-gray-300 bg-white"
        } backdrop-blur-sm sticky top-0 z-20`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1
              className={`text-2xl md:text-3xl font-bold ${
                darkMode ? "text-green-400" : "text-gray-800"
              }`}
            >
              <span className={darkMode ? "text-green-500" : "text-green-600"}>
                COMIC
              </span>{" "}
              MANAGER
            </h1>

            {/* Right Side */}
            <div className="flex items-center">
              {/* Desktop Theme Toggle */}
              <div className="hidden lg:block w-64">
                <ThemeToggle />
              </div>

              {/* Mobile Hamburger Menu */}
              <div className="lg:hidden relative z-[60]">
                <MobileMenu
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 mt-4 overflow-x-auto">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                  currentPage === page
                    ? darkMode
                      ? "border-green-500 bg-green-500 text-black font-bold shadow-lg shadow-green-500/50"
                      : "border-green-600 bg-green-600 text-white font-bold"
                    : darkMode
                    ? "border-green-500/30 text-green-400 hover:border-green-500"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {page.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
