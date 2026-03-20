import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { useState, useEffect } from "react";

export const Navbar = ({
  currentPage,
  onPageChange,
  user,
  isGuest,
  onSignOut,
}) => {
  const { darkMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // ⬇️ Filter "add" jika guest
  const pages = isGuest ? ["home", "list"] : ["home", "list", "add"];

  return (
    <>
      {/* Sticky Top Bar (Title & Profile) */}
      <div className="sticky top-0 z-30">
        
        {/* Seamless Gradient Layer */}
        <div
          className={`absolute inset-x-0 top-0 -bottom-5 pointer-events-none transition-opacity duration-300 -z-10 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: darkMode
              ? "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)"
              : "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)"
          }}
        />

        <div className="container mx-auto px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
            {/* Title */}
            <h1
              className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-green-400" : "text-gray-800"}`}
            >
              <span className={darkMode ? "text-green-500" : "text-green-600"}>
                COMIC
              </span>{" "}
              MANAGER
            </h1>

            {/* Center: Desktop Navigation Tabs (Moved up to save space) */}
            <nav className="hidden lg:flex items-center gap-2">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 sm:py-3 -my-2 sm:-my-3 flex items-center justify-center font-bold outline-none transition-all ${
                    currentPage === page
                      ? darkMode
                        ? "bg-gradient-to-b from-green-500/40 via-green-500/10 to-transparent text-green-400 border-t-4 border-green-500 rounded-b-lg"
                        : "bg-gradient-to-b from-green-600/30 via-green-600/10 to-transparent text-green-700 border-t-4 border-green-600 rounded-b-lg"
                      : darkMode
                        ? "text-green-500 hover:text-green-300 hover:bg-green-500/10 rounded-lg border-t-4 border-transparent"
                        : "text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg border-t-4 border-transparent"
                  }`}
                >
                  {page.toUpperCase()}
                </button>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Info & Theme - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Theme Toggle (Moved before User Info) */}
                <ThemeToggle />

                {user && (
                  <div className="relative">
                    {/* User Profile Button */}
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        darkMode
                          ? "border-green-500/30 hover:border-green-500 bg-black/50"
                          : "border-gray-300 hover:border-gray-400 bg-gray-50"
                      }`}
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-green-500 text-black"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {isGuest ? "👤" : user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-sm text-left">
                        <div
                          className={`font-medium ${darkMode ? "text-green-400" : "text-gray-800"}`}
                        >
                          {isGuest ? "Guest" : user.displayName || user.email}
                        </div>
                        {isGuest && (
                          <div
                            className={`text-xs ${darkMode ? "text-green-300" : "text-gray-600"}`}
                          >
                            View Only
                          </div>
                        )}
                      </div>
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''} ${darkMode ? "text-green-400" : "text-gray-600"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <div
                        className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border-2 overflow-hidden ${
                          darkMode ? "bg-black border-green-500" : "bg-white border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSignOut();
                          }}
                          className={`w-full text-left px-4 py-3 font-medium transition-colors ${
                            darkMode
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu */}
              <div className="lg:hidden relative z-[60]">
                <MobileMenu
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                  user={user}
                  isGuest={isGuest}
                  onSignOut={onSignOut}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
