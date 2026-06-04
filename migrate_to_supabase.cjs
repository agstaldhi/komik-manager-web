/**
 * Script Migrasi Data: Firestore -> Supabase
 * 
 * Script ini mengambil semua data komik dari Firestore menggunakan REST API publik
 * dan menyimpannya langsung ke database Supabase Anda.
 * 
 * Cara Menjalankan:
 * 1. Buka terminal di project directory Anda.
 * 2. Jalankan perintah: node migrate_to_supabase.js
 */

const fs = require("fs");
const path = require("path");

const getEnvValue = (key) => {
  try {
    const envPath = path.join(__dirname, ".env");
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      if (line.trim().startsWith(key)) {
        return line.split("=")[1].trim();
      }
    }
  } catch (e) {
    console.error("Error reading env:", e.message);
  }
  return null;
};

const FIRESTORE_PROJECT_ID = getEnvValue("VITE_FIREBASE_PROJECT_ID") || "comic-manager-agii";
const SUPABASE_URL = getEnvValue("VITE_SUPABASE_URL");
const SUPABASE_KEY = getEnvValue("VITE_SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ ERROR: Supabase URL atau Anon Key tidak ditemukan di file .env!");
  process.exit(1);
}

const parseFirestoreFields = (fields) => {
  const title = fields.title?.stringValue || "";
  const episode = parseInt(fields.episode?.integerValue || fields.episode?.doubleValue || fields.episode?.stringValue || 0);
  const link = fields.link?.stringValue || "";
  const is_nsfw = fields.isNSFW?.booleanValue || false;
  const thumbnail = fields.thumbnail?.stringValue || "";
  
  // Split title by '|' untuk menyusun alternative_titles array
  const titleParts = title.split("|").map(t => t.trim());
  const mainTitle = titleParts[0] || "";
  const altTitles = titleParts.slice(1).filter(t => t.length > 0);

  return {
    title: mainTitle,
    alternative_titles: altTitles,
    episode,
    link,
    is_nsfw,
    thumbnail
  };
};

const runMigration = async () => {
  console.log("=== MEMULAI MIGRASI DATA ===");
  console.log(`Mengambil data dari Firestore project: ${FIRESTORE_PROJECT_ID}...`);

  try {
    // 1. Fetch data dari Firestore REST API
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/comics?pageSize=1000`;
    const resFirestore = await fetch(firestoreUrl);
    
    if (!resFirestore.ok) {
      throw new Error(`Gagal mengambil data dari Firestore: ${resFirestore.statusText}`);
    }
    
    const firestoreJson = await resFirestore.json();
    const documents = firestoreJson.documents || [];
    
    console.log(`Berhasil mengambil ${documents.length} dokumen komik dari Firestore.`);
    
    if (documents.length === 0) {
      console.log("Tidak ada data untuk dimigrasi.");
      return;
    }

    // 2. Parse field dokumen
    const parsedComics = documents.map(doc => parseFirestoreFields(doc.fields));
    
    console.log("Mengunggah data ke Supabase...");
    
    // 3. POST ke Supabase REST API (Postgrest)
    const supabaseRestUrl = `${SUPABASE_URL}/rest/v1/comics`;
    const resSupabase = await fetch(supabaseRestUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(parsedComics)
    });

    if (!resSupabase.ok) {
      const errText = await resSupabase.text();
      throw new Error(`Gagal menyimpan data ke Supabase: ${errText}`);
    }

    const insertedData = await resSupabase.json();
    console.log(`=== MIGRASI SELESAI ===`);
    console.log(`Berhasil memigrasikan ${insertedData.length} komik ke Supabase! 🎉`);
  } catch (error) {
    console.error("❌ Terjadi Error saat migrasi:", error.message);
  }
};

runMigration();
