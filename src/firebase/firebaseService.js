import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "comics";

export const getAllComics = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const comics = [];
    querySnapshot.forEach((doc) => {
      comics.push({ id: doc.id, ...doc.data() });
    });
    return comics;
  } catch (error) {
    console.error("Error getting comics:", error);
    throw error;
  }
};

export const addComic = async (comicData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...comicData,
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...comicData, updatedAt: new Date().toISOString() };
  } catch (error) {
    console.error("Error adding comic:", error);
    throw error;
  }
};

export const updateComic = async (comicId, comicData) => {
  try {
    const comicRef = doc(db, COLLECTION_NAME, comicId);
    await updateDoc(comicRef, {
      ...comicData,
      updatedAt: new Date().toISOString(),
    });
    return { id: comicId, ...comicData, updatedAt: new Date().toISOString() };
  } catch (error) {
    console.error("Error updating comic:", error);
    throw error;
  }
};

export const deleteComic = async (comicId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, comicId));
    return comicId;
  } catch (error) {
    console.error("Error deleting comic:", error);
    throw error;
  }
};

export const bulkUploadComics = async (comicsArray) => {
  try {
    const batch = writeBatch(db); // 1. Buat Batch
    const comicsCollectionRef = collection(db, COLLECTION_NAME);

    comicsArray.forEach((comic) => {
      // 2. Tentukan referensi dokumen baru
      const docRef = doc(comicsCollectionRef);

      // 3. Tambahkan operasi 'set' ke Batch
      batch.set(docRef, {
        title: comic.title,
        episode: parseInt(comic.episode),
        link: comic.link,
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit(); // 4. Kirim Batch (Satu Permintaan Jaringan)
    return comicsArray.length;
  } catch (error) {
    console.error("Error bulk uploading comics (using Batch):", error);
    throw error;
  }
};
