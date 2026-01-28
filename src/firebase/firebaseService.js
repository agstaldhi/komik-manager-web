import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "comics";

// Helper: Convert Firestore Timestamp to ISO string
const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toISOString();

  // Jika sudah string ISO
  if (typeof timestamp === "string") return timestamp;

  // Jika Firestore Timestamp object
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }

  // Jika Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  // Fallback
  return new Date().toISOString();
};

// Get all comics (dengan filter NSFW untuk guest)
export const getAllComics = async (showNSFW = false) => {
  try {
    let q;

    if (showNSFW) {
      q = query(collection(db, COLLECTION_NAME), orderBy("title", "asc"));
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        where("isNSFW", "==", false),
        orderBy("title", "asc"),
      );
    }

    const querySnapshot = await getDocs(q);
    const comics = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      comics.push({
        id: docSnap.id,
        ...data,
        // ⬇️ Normalize updatedAt to ISO string
        updatedAt: normalizeTimestamp(data.updatedAt),
      });
    });
    return comics;
  } catch (error) {
    console.error("Error getting comics:", error);
    throw error;
  }
};

// Add new comic (dengan NSFW flag)
export const addComic = async (comicData) => {
  try {
    const now = Timestamp.now(); // ⬇️ Use Firestore Timestamp
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...comicData,
      isNSFW: comicData.isNSFW || false,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...comicData,
      isNSFW: comicData.isNSFW || false,
      updatedAt: now.toDate().toISOString(), // ⬇️ Return as ISO string
    };
  } catch (error) {
    console.error("Error adding comic:", error);
    throw error;
  }
};

// Update comic
export const updateComic = async (comicId, comicData) => {
  try {
    const now = Timestamp.now();
    const comicRef = doc(db, COLLECTION_NAME, comicId);
    await updateDoc(comicRef, {
      ...comicData,
      isNSFW: comicData.isNSFW !== undefined ? comicData.isNSFW : false,
      updatedAt: now,
    });
    return {
      id: comicId,
      ...comicData,
      updatedAt: now.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error updating comic:", error);
    throw error;
  }
};

// Delete comic (unchanged)
export const deleteComic = async (comicId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, comicId));
    return comicId;
  } catch (error) {
    console.error("Error deleting comic:", error);
    throw error;
  }
};

// Bulk upload from JSON (dengan NSFW support)
export const bulkUploadComics = async (comicsArray) => {
  try {
    const now = Timestamp.now();
    const uploadPromises = comicsArray.map((comic) =>
      addDoc(collection(db, COLLECTION_NAME), {
        title: comic.title,
        episode: parseInt(comic.episode),
        link: comic.link,
        isNSFW: comic.isNSFW || false,
        updatedAt: now,
      }),
    );
    await Promise.all(uploadPromises);
    return comicsArray.length;
  } catch (error) {
    console.error("Error bulk uploading comics:", error);
    throw error;
  }
};
