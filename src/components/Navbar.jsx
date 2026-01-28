import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export const Navbar = ({
  currentPage,
  onPageChange,
  user,
  isGuest,
  onSignOut,
}) => {
  const { darkMode } = useTheme();
  // ⬇️ Filter "add" jika guest
  const pages = isGuest ? ["home", "list"] : ["home", "list", "add"];

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`border-b-2 ${darkMode ? "border-green-500 bg-black/50" : "border-gray-300 bg-white"} backdrop-blur-sm sticky top-0 z-20`}
      >
        <div className="container mx-auto px-4 py-4">
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

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* User Info - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {user && (
                  <>
                    {/* User Avatar/Name */}
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        darkMode
                          ? "border-green-500/30 bg-black/50"
                          : "border-gray-300 bg-gray-50"
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
                      <div className="text-sm">
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
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={onSignOut}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        darkMode
                          ? "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
                    >
                      Logout
                    </button>
                  </>
                )}

                {/* Theme Toggle */}
                <div className="w-64">
                  <ThemeToggle />
                </div>
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
