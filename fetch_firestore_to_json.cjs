const fs = require("fs");
const path = require("path");

const FIRESTORE_PROJECT_ID = "comic-manager-agii";
const OUTPUT_FILE = "comics_backup.json";

const parseFirestoreFields = (fields) => {
  const title = fields.title?.stringValue || "";
  const episode = parseInt(
    fields.episode?.integerValue || 
    fields.episode?.doubleValue || 
    fields.episode?.stringValue || 
    0
  );
  const link = fields.link?.stringValue || "";
  const isNSFW = fields.isNSFW?.booleanValue || false;
  const thumbnail = fields.thumbnail?.stringValue || "";

  return {
    title,
    episode,
    link,
    isNSFW,
    thumbnail
  };
};

const fetchAndSave = async () => {
  console.log(`Mengambil data dari Firestore project: ${FIRESTORE_PROJECT_ID}...`);
  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/comics?pageSize=1000`;
    const res = await fetch(firestoreUrl);
    
    if (!res.ok) {
      throw new Error(`Gagal mengambil data dari Firestore: ${res.statusText}`);
    }
    
    const json = await res.json();
    const documents = json.documents || [];
    
    console.log(`Berhasil mengambil ${documents.length} dokumen dari Firestore.`);
    
    const parsedComics = documents.map(doc => parseFirestoreFields(doc.fields));
    
    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(parsedComics, null, 2), "utf8");
    
    console.log(`\n✅ Backup sukses! Data disimpan di: ${OUTPUT_FILE}`);
    console.log(`Total komik yang di-backup: ${parsedComics.length}`);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat membuat backup:", error.message);
  }
};

fetchAndSave();
