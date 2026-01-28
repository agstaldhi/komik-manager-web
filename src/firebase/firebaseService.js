import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "comics";

// Helper: Convert Firestore Timestamp to ISO string
const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp === "string") return timestamp;
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return new Date().toISOString();
};

// ⬇️ SIMPLIFIED: Load ALL comics (no where filter)
export const getAllComics = async () => {
  try {
    console.time("Firestore Query"); // ⬅️ Measure performance

    // Simple query: hanya orderBy title
    const q = query(collection(db, COLLECTION_NAME), orderBy("title", "asc"));

    const querySnapshot = await getDocs(q);
    console.timeEnd("Firestore Query");
    console.log("Total docs fetched:", querySnapshot.size);

    const comics = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      comics.push({
        id: docSnap.id,
        ...data,
        updatedAt: normalizeTimestamp(data.updatedAt),
        isNSFW: data.isNSFW || false, // Ensure isNSFW exists
      });
    });

    return comics;
  } catch (error) {
    console.error("Error getting comics:", error);
    throw error;
  }
};

// Add new comic
export const addComic = async (comicData) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...comicData,
      isNSFW: comicData.isNSFW || false,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...comicData,
      isNSFW: comicData.isNSFW || false,
      updatedAt: now.toDate().toISOString(),
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

// Delete comic
export const deleteComic = async (comicId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, comicId));
    return comicId;
  } catch (error) {
    console.error("Error deleting comic:", error);
    throw error;
  }
};

// Bulk upload
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
