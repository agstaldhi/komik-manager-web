import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ⬅️ Import AuthProvider
import { useComics } from "./hooks/useComics";
import { Navbar } from "./components/Navbar";
import { Toast } from "./components/Toast";
import { ModalDelete } from "./components/ModalDelete";
import { Home } from "./pages/Home";
import { List } from "./pages/List";
import { AddEdit } from "./pages/AddEdit";
import { Login } from "./pages/Login"; // ⬅️ Import Login
import { useTheme } from "./context/ThemeContext";

const AppContent = () => {
  const { darkMode } = useTheme();
  const { user, isGuest, canEdit, showNSFW, signOut } = useAuth(); // ⬅️ Auth state
  const { comics, loading, addComic, updateComic, deleteComic, bulkUpload } =
    useComics(showNSFW); // ⬅️ Pass showNSFW

  const [page, setPage] = useState("home");
  const [editingComic, setEditingComic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  }, [darkMode]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (newPage === "add") {
      setEditingComic(null);
    }
  };

  const handleEdit = (comic) => {
    if (!canEdit) {
      showNotification("Guest mode tidak bisa edit komik!", "error");
      return;
    }
    setEditingComic(comic);
    setPage("add");
  };

  const handleSave = async (formData) => {
    if (!canEdit) {
      showNotification("Guest mode tidak bisa menambah/edit komik!", "error");
      return;
    }

    if (!formData.title || !formData.episode || !formData.link) {
      showNotification("Semua field harus diisi!", "error");
      return;
    }

    let result;
    if (editingComic) {
      result = await updateComic(editingComic.id, {
        title: formData.title,
        episode: parseInt(formData.episode),
        link: formData.link,
        isNSFW: formData.isNSFW || false, // ⬅️ Support NSFW
      });
    } else {
      result = await addComic({
        title: formData.title,
        episode: parseInt(formData.episode),
        link: formData.link,
        isNSFW: formData.isNSFW || false, // ⬅️ Support NSFW
      });
    }

    if (result.success) {
      showNotification(result.message, "success");
      setEditingComic(null);
      setPage("list");
    } else {
      showNotification(result.message, "error");
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

  const handleUploadJSON = async (e) => {
    if (!canEdit) {
      showNotification("Guest mode tidak bisa upload komik!", "error");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        const result = await bulkUpload(jsonData);

        if (result.success) {
          showNotification(result.message, "success");
        } else {
          showNotification(result.message, "error");
        }
      } catch (error) {
        showNotification("Format JSON tidak valid!", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSignOut = async () => {
    if (window.confirm("Yakin ingin logout?")) {
      const result = await signOut();
      if (result.success) {
        showNotification("Berhasil logout!", "success");
        setPage("home");
      }
    }
  };

  // ⬇️ REDIRECT KE LOGIN JIKA BELUM LOGIN ⬇️
  if (!user) {
    return <Login />;
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-black text-green-400" : "bg-gray-100 text-gray-800"} transition-colors duration-300`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
            <div className="text-green-400 text-xl font-bold">Loading...</div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className="fixed z-[100]">
        <Toast notification={notification} />
      </div>

      {/* Delete Modal */}
      <ModalDelete
        comic={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(null)}
      />

      {/* Navbar with Logout */}
      <Navbar
        currentPage={page}
        onPageChange={handlePageChange}
        user={user}
        isGuest={isGuest}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {page === "home" && <Home key="home" comics={comics} />}

          {page === "list" && (
            <List
              key="list"
              comics={comics}
              onEdit={handleEdit}
              onDelete={setShowDeleteModal}
              onUploadJSON={handleUploadJSON}
              canEdit={canEdit} // ⬅️ Pass canEdit prop
            />
          )}

          {page === "add" &&
            canEdit && ( // ⬅️ Hanya tampil jika bisa edit
              <AddEdit
                key="add"
                editingComic={editingComic}
                onSave={handleSave}
                onCancel={() => {
                  setEditingComic(null);
                  setPage("list");
                }}
              />
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {" "}
        {/* ⬅️ Wrap with AuthProvider */}
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
