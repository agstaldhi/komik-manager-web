import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useComics } from "./hooks/useComics";
import { Toast } from "./components/Toast";
import { ModalDelete } from "./components/ModalDelete";
import { ModalLogout } from "./components/ModalLogout";
import { Home } from "./pages/Home";
import { List } from "./pages/List";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { About } from "./pages/About";
import { SparklesText } from "./components/SparklesText";
import { NavBar } from "./components/NavBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { AuroraBackground } from "./components/AuroraBackground";
import { BookOpen, ChevronDown, Home as HomeIcon, Info, LogOut, Settings as SettingsIcon, User } from "lucide-react";

const AppContent = () => {
  const { darkMode } = useTheme();
  const { user, isGuest, canEdit, showNSFW, signOut } = useAuth();
  const { comics, loading, addComic, updateComic, deleteComic, bulkUpload } = useComics(showNSFW);

  const [page, setPage] = useState("home");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notification, setNotification] = useState(null);

  // States to retain List page filters/pagination when switching tabs
  const [listPage, setListPage] = useState(1);
  const [listSearch, setListSearch] = useState("");
  const [listNsfwFilter, setListNsfwFilter] = useState("all");
  const [listSortConfig, setListSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light-mode");
    }
  }, [darkMode]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSave = async (editingComic, formData) => {
    if (!canEdit) {
      showNotification("Guest mode tidak bisa menambah/edit komik!", "error");
      return { success: false, message: "Guest mode disabled" };
    }

    if (!formData.title || !formData.episode || !formData.link) {
      showNotification("Semua field harus diisi!", "error");
      return { success: false, message: "Required fields missing" };
    }

    let result;
    if (editingComic) {
      result = await updateComic(editingComic.id, {
        title: formData.title,
        alternativeTitles: formData.alternativeTitles || [],
        episode: parseInt(formData.episode),
        link: formData.link,
        isNSFW: formData.isNSFW || false,
        thumbnail: formData.thumbnail || "",
      });
    } else {
      result = await addComic({
        title: formData.title,
        alternativeTitles: formData.alternativeTitles || [],
        episode: parseInt(formData.episode),
        link: formData.link,
        isNSFW: formData.isNSFW || false,
        thumbnail: formData.thumbnail || "",
      });
    }

    if (result.success) {
      showNotification(result.message, "success");
      return { success: true };
    } else {
      showNotification(result.message, "error");
      return { success: false, message: result.message };
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      showNotification("Guest mode tidak bisa hapus komik!", "error");
      return;
    }

    if (!showDeleteModal) return;

    const result = await deleteComic(showDeleteModal.id);

    if (result.success) {
      showNotification(result.message, "success");
    } else {
      showNotification(result.message, "error");
    }

    setShowDeleteModal(null);
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    const result = await signOut();
    if (result.success) {
      showNotification("Berhasil logout!", "success");
      setPage("home");
    }
  };

  // Redirect to Login if unauthenticated
  if (!user) {
    return <Login />;
  }

  const navItems = [
    { name: "Home", url: "home", icon: HomeIcon },
    { name: "List Comics", url: "list", icon: BookOpen },
    { name: "Settings", url: "settings", icon: SettingsIcon },
    { name: "About", url: "about", icon: Info },
  ];

  return (
    <AuroraBackground className="flex-col w-full text-zinc-900 dark:text-zinc-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] transition-all">
          <div className="p-8 rounded-3xl border border-zinc-800 bg-black/80 flex flex-col items-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
            <div className="text-zinc-100 text-lg font-black tracking-wider">Syncing Database...</div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className="fixed z-[100] top-4 right-4">
        <Toast notification={notification} />
      </div>

      {/* Delete Modal */}
      <ModalDelete
        comic={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(null)}
      />

      {/* Logout Modal */}
      <ModalLogout
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* FLOATING TOP HEADER CAPSULE */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl h-12 sm:h-14 z-40 rounded-full border border-border/40 dark:border-zinc-800/80 bg-background/90 dark:bg-zinc-950/90 md:bg-background/35 md:dark:bg-zinc-950/40 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between shadow-xl pointer-events-auto select-none">
        {/* Logo Brand left side */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
          <SparklesText
            text="Comic Gio"
            className="text-lg sm:text-xl font-black tracking-tight"
            colors={{ first: "#10b981", second: "#6366f1" }}
            sparklesCount={6}
          />
        </div>

        {/* Middle Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 relative">
          {navItems.map((item) => {
            const isActive = page === item.url;
            return (
              <button
                key={item.name}
                onClick={() => handlePageChange(item.url)}
                className={`relative cursor-pointer text-xs sm:text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 outline-none select-none ${
                  isActive ? "text-primary font-bold" : "text-foreground/75 hover:text-primary"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="header-lamp"
                    className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Area: Theme Switch + Profile Badge */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/30 backdrop-blur-sm text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 outline-none hover:border-emerald-500/50 active:scale-[0.97]"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="max-w-[70px] sm:max-w-[100px] truncate uppercase text-zinc-700 dark:text-zinc-300">
                {isGuest ? "Guest" : user.displayName || user.email?.split("@")[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl pointer-events-auto"
                >
                  <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-900 mb-1">
                    Account Status
                  </div>
                  <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-bold truncate">
                    {user.email || "Anonymous Guest"}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2 text-xs font-bold mt-1 outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isGuest ? "Exit Guest Mode" : "Logout"}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Floating Bottom Tab Bar (Mobile Only) */}
      <NavBar
        items={navItems}
        activeTab={page}
        onTabChange={handlePageChange}
        className="md:hidden"
      />

      {/* MAIN CONTAINER CONTENT */}
      <main className="container mx-auto px-4 pt-28 pb-24 sm:pt-32 sm:pb-28 relative z-10 flex-1 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {page === "home" && (
            <Home 
              key="home" 
              comics={comics} 
              onNavigate={handlePageChange}
            />
          )}

          {page === "list" && (
            <List
              key="list"
              comics={comics}
              onSaveComic={handleSave}
              onDelete={setShowDeleteModal}
              canEdit={canEdit}
              currentPage={listPage}
              setCurrentPage={setListPage}
              searchQuery={listSearch}
              setSearchQuery={setListSearch}
              nsfwFilter={listNsfwFilter}
              setNsfwFilter={setListNsfwFilter}
              sortConfig={listSortConfig}
              setSortConfig={setListSortConfig}
            />
          )}

          {page === "settings" && (
            <Settings
              key="settings"
              comics={comics}
              bulkUpload={bulkUpload}
              showNotification={showNotification}
            />
          )}

          {page === "about" && (
            <About 
              key="about" 
            />
          )}
        </AnimatePresence>
      </main>
    </AuroraBackground>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
