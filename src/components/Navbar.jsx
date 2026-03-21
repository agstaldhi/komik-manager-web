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
  
  const pages = isGuest ? ["home", "list"] : ["home", "list", "add"];

  return (
    <>
      {/* Floating Navbar Container */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        
        {/* The Navbar Pill */}
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl rounded-full backdrop-blur-xl shadow-2xl border transition-all duration-300 p-2 sm:p-2.5 ${
            darkMode
              ? "bg-green-950/40 border-green-500/20 shadow-green-900/40"
              : "bg-green-50/70 border-green-600/20 shadow-green-100/50"
          } ${isScrolled ? "scale-[0.98] sm:scale-100" : ""}`}
        >
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all ${
              darkMode ? "bg-green-500 text-black shadow-green-500/30" : "bg-green-600 text-white shadow-green-600/30"
            }`}>
              {/* Abstract Logo Icon (like a hexagon/bolt) */}
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-current transform rotate-45 rounded-sm" />
            </div>
            <h1 className={`hidden sm:block text-sm md:text-base font-extrabold tracking-widest ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}>
              COMIC<span className="opacity-60">MANAGER</span>
            </h1>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 px-6">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative px-4 py-2 font-bold text-sm tracking-wide transition-colors ${
                  currentPage === page
                    ? darkMode
                      ? "text-green-400"
                      : "text-green-700"
                    : darkMode
                      ? "text-green-100/60 hover:text-green-400"
                      : "text-green-900/60 hover:text-green-700"
                }`}
              >
                {page === "home" ? "Home" : page === "list" ? "List" : "Add Comic"}
                {/* Active Indicator Underline */}
                {currentPage === page && (
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full ${
                    darkMode ? "bg-green-500" : "bg-green-600"
                  }`} />
                )}
              </button>
            ))}
          </div>

          {/* Right Section (Theme Toggle + User Pill + Mobile Menu) */}
          <div className="flex items-center gap-2 pr-1 sm:pr-2">
            
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {user && (
              <div className="relative hidden md:block">
                {/* Let's Talk style profile button */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                    darkMode
                      ? "bg-green-500 text-black hover:bg-green-400 shadow-green-500/20"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/30"
                  }`}
                >
                  <span className="max-w-[80px] sm:max-w-[120px] truncate uppercase">
                    {isGuest ? "GUEST" : user.displayName || user.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`hidden sm:block w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    className={`absolute right-0 top-full mt-3 w-48 rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden pointer-events-auto ${
                      darkMode ? "bg-black/90 border-white/20" : "bg-white/90 border-black/10"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSignOut();
                      }}
                      className={`w-full text-left px-5 py-4 font-bold text-sm transition-colors flex items-center gap-3 ${
                        darkMode
                          ? "text-red-400 hover:bg-white/10"
                          : "text-red-600 hover:bg-black/5"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      {isGuest ? "Exit Guest Mode" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center bg-transparent">
              <MobileMenu
                currentPage={currentPage}
                onPageChange={onPageChange}
                user={user}
                isGuest={isGuest}
                onSignOut={onSignOut}
              />
            </div>
          </div>

        </nav>
      </div>
      
      {/* Spacer to push page content down since navbar is now `fixed` instead of `sticky` */}
      <div className="h-24 sm:h-28 hidden md:block"></div>
      <div className="h-20 sm:h-24 md:hidden"></div>
    </>
  );
};
