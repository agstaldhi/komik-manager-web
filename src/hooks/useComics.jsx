import { useState, useEffect } from "react";
import {
  getAllComics,
  addComic as addComicDB,
  updateComic as updateComicDB,
  deleteComic as deleteComicDB,
  bulkUploadComics as bulkUploadDB,
} from "../firebase/firebaseService";

export const useComics = (showNSFW = false) => {
  const [allComics, setAllComics] = useState([]); // ⬅️ Store ALL comics
  const [comics, setComics] = useState([]); // ⬅️ Filtered comics
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⬇️ Load ALL comics from Firestore (1x only)
  const loadComics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllComics(); // No showNSFW parameter
      setAllComics(data); // Store all

      // Filter based on showNSFW
      const filtered = showNSFW ? data : data.filter((c) => !c.isNSFW);

      setComics(filtered);
    } catch (err) {
      setError("Gagal memuat data dari Firestore");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Filter comics when showNSFW changes (client-side, instant)
  useEffect(() => {
    if (allComics.length > 0) {
      const filtered = showNSFW
        ? allComics
        : allComics.filter((c) => !c.isNSFW);

      setComics(filtered);
    }
  }, [showNSFW, allComics]);

  // Add comic
  const addComic = async (comicData) => {
    setLoading(true);
    setError(null);
    try {
      const isDuplicate = allComics.some(
        (comic) =>
          comic.title.toLowerCase().trim() ===
          comicData.title.toLowerCase().trim(),
      );

      if (isDuplicate) {
        throw new Error("Judul komik sudah ada!");
      }

      const newComic = await addComicDB(comicData);

      // Update both allComics and comics
      const updatedAll = [...allComics, newComic].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      setAllComics(updatedAll);

      const filtered = showNSFW
        ? updatedAll
        : updatedAll.filter((c) => !c.isNSFW);
      setComics(filtered);

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
      const isDuplicate = allComics.some(
        (comic) =>
          comic.id !== comicId &&
          comic.title.toLowerCase().trim() ===
            comicData.title.toLowerCase().trim(),
      );

      if (isDuplicate) {
        throw new Error("Judul komik sudah ada!");
      }

      const updated = await updateComicDB(comicId, comicData);

      // Update both allComics and comics
      const updatedAll = allComics
        .map((c) => (c.id === comicId ? updated : c))
        .sort((a, b) => a.title.localeCompare(b.title));
      setAllComics(updatedAll);

      const filtered = showNSFW
        ? updatedAll
        : updatedAll.filter((c) => !c.isNSFW);
      setComics(filtered);

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

      // Update both
      const updatedAll = allComics.filter((c) => c.id !== comicId);
      setAllComics(updatedAll);
      setComics(updatedAll.filter((c) => showNSFW || !c.isNSFW));

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
      await loadComics(); // Reload all
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

  // ⬇️ Load ONCE on mount
  useEffect(() => {
    loadComics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  return {
    comics, // Filtered comics
    loading,
    error,
    loadComics,
    addComic,
    updateComic,
    deleteComic,
    bulkUpload,
  };
};
