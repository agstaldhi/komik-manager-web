const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Read from env file
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

const SUPABASE_URL = getEnvValue("VITE_SUPABASE_URL");
const SUPABASE_KEY = getEnvValue("VITE_SUPABASE_ANON_KEY");
const OUTPUT_FILE = "comics_backup.json";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ ERROR: Supabase URL atau Anon Key tidak ditemukan di file .env!");
  process.exit(1);
}

const backupSupabase = async () => {
  console.log("Mengambil seluruh data komik dari Supabase untuk backup...");
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Fetch all comics
    const { data: comics, error } = await supabase
      .from("comics")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      throw error;
    }

    // Format to bulk upload format
    const formattedComics = comics.map((c) => {
      // Re-combine title and alternative titles into single string with '|'
      const fullTitle = [c.title, ...(c.alternative_titles || [])].join(" | ");
      return {
        title: fullTitle,
        episode: c.episode,
        link: c.link,
        isNSFW: c.is_nsfw,
        thumbnail: c.thumbnail || ""
      };
    });

    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(formattedComics, null, 2), "utf8");

    console.log(`\n✅ Backup dari Supabase sukses!`);
    console.log(`Data disimpan di: ${OUTPUT_FILE}`);
    console.log(`Total komik yang di-backup: ${formattedComics.length}`);
  } catch (err) {
    console.error("❌ Terjadi kesalahan saat melakukan backup Supabase:", err.message);
  }
};

backupSupabase();
