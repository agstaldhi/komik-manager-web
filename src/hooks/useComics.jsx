import { useState, useEffect } from "react";
import {
  getAllComics,
  addComic as addComicDB,
  updateComic as updateComicDB,
  deleteComic as deleteComicDB,
  bulkUploadComics as bulkUploadDB,
} from "../firebase/firebaseService";

export const useComics = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load comics
  const loadComics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllComics();
      setComics(data);
    } catch (err) {
      setError("Gagal memuat data dari Firestore");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add comic
  const addComic = async (comicData) => {
    setLoading(true);
    setError(null);
    try {
      // Check duplicate
      const isDuplicate = comics.some(
        (comic) =>
          comic.title.toLowerCase().trim() ===
          comicData.title.toLowerCase().trim()
      );

      if (isDuplicate) {
        throw new Error("Judul komik sudah ada!");
      }

      const newComic = await addComicDB(comicData);
      setComics(
        [...comics, newComic].sort((a, b) => a.title.localeCompare(b.title))
      );
      return { success: true, message: "Komik berhasil ditambahkan!" };
    } catch (err) {
      setError(err.message || "Gagal menambahkan komik");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update comic
  const updateComic = async (comicId, comicData) => {
    setLoading(true);
    setError(null);
    try {
      // Check duplicate (exclude current comic)
      const isDuplicate = comics.some(
        (comic) =>
          comic.id !== comicId &&
          comic.title.toLowerCase().trim() ===
            comicData.title.toLowerCase().trim()
      );

      if (isDuplicate) {
        throw new Error("Judul komik sudah ada!");
      }

      const updated = await updateComicDB(comicId, comicData);
      setComics(
        comics
          .map((c) => (c.id === comicId ? updated : c))
          .sort((a, b) => a.title.localeCompare(b.title))
      );
      return { success: true, message: "Komik berhasil diperbarui!" };
    } catch (err) {
      setError(err.message || "Gagal memperbarui komik");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete comic
  const deleteComic = async (comicId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComicDB(comicId);
      setComics(comics.filter((c) => c.id !== comicId));
      return { success: true, message: "Komik berhasil dihapus!" };
    } catch (err) {
      setError(err.message || "Gagal menghapus komik");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Bulk upload
  const bulkUpload = async (comicsArray) => {
    setLoading(true);
    setError(null);
    try {
      await bulkUploadDB(comicsArray);
      await loadComics(); // Reload data
      return {
        success: true,
        message: `${comicsArray.length} komik berhasil diimport!`,
      };
    } catch (err) {
      setError(err.message || "Gagal upload komik");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadComics();
  }, []);

  return {
    comics,
    loading,
    error,
    loadComics,
    addComic,
    updateComic,
    deleteComic,
    bulkUpload,
  };
};
