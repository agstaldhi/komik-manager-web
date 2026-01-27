import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { useComics } from "./hooks/useComics";
import { Navbar } from "./components/Navbar";
import { Toast } from "./components/Toast";
import { ModalDelete } from "./components/ModalDelete";
import { Home } from "./pages/Home";
import { List } from "./pages/List";
import { AddEdit } from "./pages/AddEdit";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

const AppContent = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { comics, loading, addComic, updateComic, deleteComic, bulkUpload } =
    useComics();

  const [page, setPage] = useState("home");
  const [editingComic, setEditingComic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [notification, setNotification] = useState(null);

  if (!user) {
    return <Login />;
  }

  // Update HTML class untuk background color
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
    setEditingComic(comic);
    setPage("add");
  };

  const handleSave = async (formData) => {
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
      });
    } else {
      result = await addComic({
        title: formData.title,
        episode: parseInt(formData.episode),
        link: formData.link,
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

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-green-400" : "bg-gray-100 text-gray-800"
      } transition-colors duration-300`}
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

      {/* Navbar */}
      <Navbar currentPage={page} onPageChange={handlePageChange} />

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
            />
          )}

          {page === "add" && (
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
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
