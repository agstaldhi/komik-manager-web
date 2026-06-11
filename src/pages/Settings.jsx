import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle, Download, FileJson, FileSpreadsheet, Play, Trash2, Upload, ShieldAlert } from "lucide-react";
import { getTitlesList } from "../utils/titleUtils";

export const Settings = ({ comics, bulkUpload, showNotification }) => {
  const { darkMode } = useTheme();
  const { canEdit } = useAuth();
  
  const [logs, setLogs] = useState([
    {
      time: new Date().toLocaleTimeString(),
      type: "info",
      message: "System initialized. Ready for Import/Export operations."
    }
  ]);
  const [duplicateMode, setDuplicateMode] = useState("skip"); // "skip" or "overwrite" (default: skip)

  const addLog = (type, message) => {
    setLogs((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        type,
        message
      }
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("info", "Logs cleared.");
  };

  // CSV line parser (handles commas inside quotes, empty values, and escaped quotes)
  const parseCSVLine = (line) => {
    const result = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++; // Skip next quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        result.push(entry);
        entry = '';
      } else {
        entry += char;
      }
    }
    result.push(entry);
    return result;
  };

  // CSV parser
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return [];
    
    // Parse headers
    const firstLine = lines[0].trim();
    if (!firstLine) return [];
    const headers = parseCSVLine(firstLine).map(h => h.trim().toLowerCase());
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const matches = parseCSVLine(line);
      const row = {};

      headers.forEach((header, index) => {
        let val = matches[index] !== undefined ? matches[index].trim() : "";
        row[header] = val;
      });
      results.push(row);
    }
    return results;
  };

  // Process data for import
  const processImport = async (rawData, formatName) => {
    if (!canEdit) {
      addLog("error", "Access Denied: Guest mode cannot import comics.");
      showNotification("Guest mode tidak bisa import!", "error");
      return;
    }

    addLog("info", `Analyzing ${rawData.length} rows from uploaded ${formatName} file...`);

    // Detect if any titles contain the forbidden separator "|"
    let hasPipeSeparator = false;
    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];
      const title = (item.title || item.Title || "");
      if (title.includes("|")) {
        hasPipeSeparator = true;
        break;
      }

      // Check alternative titles
      const altVal = item.alternativeTitles || item.alternative_titles || item.altTitles || item.alt_titles || item.alternativetitles || "";
      if (Array.isArray(altVal)) {
        if (altVal.some(t => typeof t === "string" && t.includes("|"))) {
          hasPipeSeparator = true;
          break;
        }
      } else if (typeof altVal === "string" && altVal.includes("|")) {
        hasPipeSeparator = true;
        break;
      }
    }

    if (hasPipeSeparator) {
      addLog("error", "Import Gagal: File mengandung karakter separator '|' yang dilarang pada judul.");
      showNotification("File mengandung separator '|' yang dilarang!", "error");
      return;
    }

    const validComics = [];
    let duplicateCount = 0;
    let newCount = 0;
    let updateCount = 0;

    // Sets to track duplicates within the imported file itself (session)
    const importedTitlesInSession = new Set();
    const importedLinksInSession = new Set();

    // Helper: detect if a thumbnail URL is empty or invalid (not starting with http:// or https://)
    const isThumbnailBrokenOrEmpty = (url) => {
      if (!url || url.trim() === "") return true;
      const u = url.trim().toLowerCase();
      return !u.startsWith("http://") && !u.startsWith("https://");
    };

    rawData.forEach((item, index) => {
      // Handle potential CSV/JSON key variants
      const title = (item.title || item.Title || "").trim();
      const episode = parseInt(item.episode || item.Episode || item.eps || 1, 10);
      const link = (item.link || item.Link || item.url || "").trim();
      const isNSFW = item.isNSFW === true || item.isNSFW === "true" || item.is_nsfw === true || item.is_nsfw === "true" || item.nsfw === "true" || item.nsfw === true;
      const thumbnail = (item.thumbnail || item.Thumbnail || item.cover || "").trim();

      if (!title || !link) {
        addLog("warning", `Row #${index + 2}: Skipped. Title or Link is missing.`);
        return;
      }

      // Parse alternativeTitles
      let alternativeTitles = [];
      const altVal = item.alternativeTitles || item.alternative_titles || item.altTitles || item.alt_titles || item.alternativetitles;
      if (Array.isArray(altVal)) {
        alternativeTitles = altVal.map(t => (t || "").trim()).filter(Boolean);
      } else if (typeof altVal === "string") {
        // For CSV, alternative titles are separated by semicolon ';'
        alternativeTitles = altVal.split(";").map(t => t.trim()).filter(Boolean);
      }

      const cleanLink = link.trim().toLowerCase();
      const itemTitlesLower = [title, ...alternativeTitles].map(t => t.trim().toLowerCase()).filter(Boolean);

      // 1. Check for duplicates within the current import file (session duplicates)
      const isSessionDuplicateTitle = itemTitlesLower.some(t => importedTitlesInSession.has(t));
      const isSessionDuplicateLink = cleanLink && importedLinksInSession.has(cleanLink);

      if (isSessionDuplicateTitle || isSessionDuplicateLink) {
        duplicateCount++;
        addLog("warning", `Row #${index + 2}: Skipped. Duplicate entry within the uploaded file itself.`);
        return;
      }

      // 2. Find if this comic matches any existing comic in the database
      const matchedComic = comics.find(c => {
        // Check title overlap
        const existingTitles = getTitlesList(c);
        const hasTitleOverlap = itemTitlesLower.some(t => existingTitles.includes(t));
        if (hasTitleOverlap) return true;

        // Check link match
        if (cleanLink && c.link && c.link.trim().toLowerCase() === cleanLink) {
          return true;
        }
        return false;
      });

      if (matchedComic) {
        // Match found! Check if we need to update thumbnail or alternative titles
        let needsUpdate = false;
        const updateLogMsg = [];
        const updatedFields = {
          id: matchedComic.id,
          title: matchedComic.title, // Keep DB title
          episode: matchedComic.episode, // Keep DB episode
          link: matchedComic.link, // Keep DB link
          isNSFW: matchedComic.isNSFW, // Keep DB isNSFW
          thumbnail: matchedComic.thumbnail || "", // Start with DB thumbnail
          alternativeTitles: matchedComic.alternativeTitles || [] // Start with DB alt titles
        };

        // Check thumbnail update
        if (isThumbnailBrokenOrEmpty(matchedComic.thumbnail) && !isThumbnailBrokenOrEmpty(thumbnail)) {
          updatedFields.thumbnail = thumbnail;
          needsUpdate = true;
          updateLogMsg.push("thumbnail updated");
        }

        // Check alternative titles merge
        const existingTitlesLower = getTitlesList(matchedComic);
        const newAlternativeTitlesToAdd = [];
        
        // Candidates from import: main title and all imported alternative titles
        const importedTitleCandidates = [title, ...alternativeTitles].map(t => t.trim()).filter(Boolean);
        importedTitleCandidates.forEach(cand => {
          if (!existingTitlesLower.includes(cand.toLowerCase())) {
            newAlternativeTitlesToAdd.push(cand);
          }
        });

        if (newAlternativeTitlesToAdd.length > 0) {
          updatedFields.alternativeTitles = [
            ...(matchedComic.alternativeTitles || []),
            ...newAlternativeTitlesToAdd
          ];
          needsUpdate = true;
          updateLogMsg.push(`added alternative titles: ${newAlternativeTitlesToAdd.join(", ")}`);
        }

        if (needsUpdate) {
          updateCount++;
          validComics.push(updatedFields);
          addLog("info", `Row #${index + 2}: Update scheduled for "${matchedComic.title}" (${updateLogMsg.join("; ")}).`);
        } else {
          duplicateCount++;
          addLog("warning", `Duplicate title/link: "${title}" already exists in database with no new updates. Skipped.`);
        }

        // Mark as processed in session to prevent duplicate processing if listed again
        itemTitlesLower.forEach(t => importedTitlesInSession.add(t));
        if (cleanLink) importedLinksInSession.add(cleanLink);

      } else {
        // No match found: insert as new comic
        newCount++;
        validComics.push({
          title,
          alternativeTitles,
          episode,
          link,
          isNSFW,
          thumbnail
        });

        // Mark as processed in session
        itemTitlesLower.forEach(t => importedTitlesInSession.add(t));
        if (cleanLink) importedLinksInSession.add(cleanLink);
      }
    });

    if (validComics.length === 0) {
      addLog("warning", `Import process stopped: 0 new/updated comics out of ${rawData.length} rows. All were skipped/duplicates.`);
      showNotification("Tidak ada komik baru atau perubahan data yang diimport!", "error");
      return;
    }

    addLog("info", `Syncing ${validComics.length} comics to database (${newCount} new, ${updateCount} updates)...`);
    const result = await bulkUpload(validComics);

    if (result.success) {
      addLog("success", `Import selesai. Berhasil menambahkan ${newCount} komik baru dan memperbarui ${updateCount} komik lama.`);
      showNotification(`Berhasil memproses ${validComics.length} data komik!`, "success");
    } else {
      addLog("error", `Failed to save imported comics: ${result.message}`);
      showNotification("Gagal import data!", "error");
    }
  };

  // Import JSON File trigger
  const handleJSONImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    addLog("info", `Reading file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        const dataArr = Array.isArray(jsonData) ? jsonData : [jsonData];
        processImport(dataArr, "JSON");
      } catch (err) {
        addLog("error", "Failed to parse JSON file. Invalid format.");
        showNotification("Format JSON tidak valid!", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Import CSV File trigger
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    addLog("info", `Reading file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = parseCSV(event.target.result);
        processImport(csvData, "CSV");
      } catch (err) {
        addLog("error", "Failed to parse CSV file. Invalid format.");
        showNotification("Format CSV tidak valid!", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Export JSON
  const handleJSONExport = () => {
    addLog("info", "Starting JSON export...");
    try {
      const cleanData = comics.map(c => ({
        title: c.title,
        alternativeTitles: c.alternativeTitles || [],
        episode: c.episode,
        link: c.link,
        isNSFW: c.isNSFW,
        thumbnail: c.thumbnail
      }));

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(cleanData, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `comics_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addLog("success", `Exported ${cleanData.length} comics to JSON file.`);
      showNotification("Sukses mengeksport JSON!", "success");
    } catch (err) {
      addLog("error", `JSON Export failed: ${err.message}`);
    }
  };

  // Export CSV
  const handleCSVExport = () => {
    addLog("info", "Starting CSV export...");
    try {
      const csvRows = ["Title,AlternativeTitles,Episode,Link,isNSFW,Thumbnail"];
      
      comics.forEach(c => {
        // Escape quotes and commas in fields
        const escapedTitle = `"${c.title.replace(/"/g, '""')}"`;
        const altTitlesStr = (c.alternativeTitles || []).join("; ");
        const escapedAltTitles = `"${altTitlesStr.replace(/"/g, '""')}"`;
        const escapedLink = `"${c.link.replace(/"/g, '""')}"`;
        const escapedCover = `"${(c.thumbnail || "").replace(/"/g, '""')}"`;
        csvRows.push(`${escapedTitle},${escapedAltTitles},${c.episode},${escapedLink},${c.isNSFW},${escapedCover}`);
      });

      const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
        csvRows.join("\n")
      )}`;
      
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", csvString);
      downloadAnchor.setAttribute("download", `comics_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addLog("success", `Exported ${comics.length} comics to CSV file.`);
      showNotification("Sukses mengeksport CSV!", "success");
    } catch (err) {
      addLog("error", `CSV Export failed: ${err.message}`);
    }
  };

  // Run local database integrity check for duplicate titles & links
  const runLocalDuplicateCheck = () => {
    addLog("info", `Starting database integrity check on ${comics.length} records...`);
    
    let duplicateLinksCount = 0;
    let duplicateTitlesCount = 0;

    // --- CHECK DUPLICATE LINKS ---
    const linkGroups = {};
    comics.forEach((comic) => {
      const cleanLink = (comic.link || '').trim().toLowerCase();
      if (!cleanLink) return;

      if (!linkGroups[cleanLink]) {
        linkGroups[cleanLink] = [];
      }
      linkGroups[cleanLink].push(comic);
    });

    const duplicateLinks = Object.entries(linkGroups).filter(([_, group]) => group.length > 1);

    if (duplicateLinks.length > 0) {
      addLog("warning", "=== TEMUAN DUPLIKAT LINK URL ===");
      duplicateLinks.forEach(([link, group]) => {
        const info = group.map(c => `"${c.title}" (ID: ${c.id.substring(0, 8)}...)`).join(" vs ");
        addLog("warning", `Link URL [${link}] digunakan oleh: ${info}`);
        duplicateLinksCount += group.length - 1;
      });
    }

    // --- CHECK DUPLICATE TITLES ---
    const titleToComics = {};
    comics.forEach((comic) => {
      const variants = getTitlesList(comic);
      variants.forEach((v) => {
        if (!titleToComics[v]) {
          titleToComics[v] = [];
        }
        titleToComics[v].push(comic);
      });
    });

    const duplicateTitles = Object.entries(titleToComics).filter(([_, group]) => group.length > 1);

    if (duplicateTitles.length > 0) {
      addLog("warning", "=== TEMUAN DUPLIKAT JUDUL / JUDUL ALTERNATIF ===");
      duplicateTitles.forEach(([variant, group]) => {
        const info = group.map(c => `"${c.title}" (ID: ${c.id.substring(0, 8)}...)`).join(" vs ");
        addLog("warning", `Judul [${variant}] digunakan oleh: ${info}`);
        duplicateTitlesCount += group.length - 1;
      });
    }

    // --- FINAL REPORT ---
    if (duplicateLinksCount === 0 && duplicateTitlesCount === 0) {
      addLog("success", "INTEGRITAS DATABASE AMAN: Tidak ditemukan duplikat judul maupun link URL.");
      showNotification("Integrasi database aman! Tidak ada duplikat.", "success");
    } else {
      addLog("error", `HASIL DETEKSI: Ditemukan ${duplicateLinksCount} duplikat link dan ${duplicateTitlesCount} duplikat judul. Silakan periksa detailnya di log console.`);
      showNotification(`Ditemukan duplikat! Periksa log console.`, "error");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Panel 0: Database Integrity Check */}
      <div className="p-6 sm:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md">
        <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span>Database Integrity Check</span>
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6 leading-relaxed font-medium">
          Scan the entire local catalog of {comics.length} comics to detect duplicate title variants (main or alternative) and duplicate URL links. The detailed report will be output directly to the Activity Logs Console below.
        </p>
        <button
          onClick={runLocalDuplicateCheck}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-black font-extrabold text-sm transition-all select-none outline-none hover:shadow-lg hover:shadow-amber-500/15 active:scale-[0.98]"
        >
          <Play className="w-4 h-4" />
          <span>Jalankan Pengecekan Duplikat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Panel 1: Import */}
        <div className="p-6 sm:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              <span>Import Comics</span>
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6 leading-relaxed font-medium">
              Upload JSON or CSV files to batch import comics. Duplicate titles will be automatically detected and skipped to preserve database integrity.
            </p>

            <div className="space-y-4">
              {/* Import JSON Input */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-all group">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Import JSON File
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Batch upload .json catalog
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJSONImport}
                  disabled={!canEdit}
                  className="hidden"
                />
              </label>

              {/* Import CSV Input */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-all group">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Import CSV File
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Batch upload .csv sheet (comma separated)
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  disabled={!canEdit}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {!canEdit && (
            <div className="mt-6 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[11px] font-bold flex items-center gap-1.5 leading-tight">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Login as Admin to perform batch imports.</span>
            </div>
          )}
        </div>

        {/* Panel 2: Export */}
        <div className="p-6 sm:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-emerald-500" />
              <span>Export Comics</span>
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6 leading-relaxed font-medium">
              Download your entire catalog of {comics.length} comics as either a structured JSON schema or a CSV spreadsheet file for offline backup.
            </p>

            <div className="space-y-3">
              {/* Export JSON Button */}
              <button
                onClick={handleJSONExport}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-all group text-left outline-none"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Export JSON Schema
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Save as backup.json database structure
                  </div>
                </div>
              </button>

              {/* Export CSV Button */}
              <button
                onClick={handleCSVExport}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-all group text-left outline-none"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Export CSV Spreadsheet
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Save as sheet.csv format readable by Excel
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Panel 3: Interactive Logs Console */}
      <div className="p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-950">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-500 rotate-90" />
            <span>Activity Logs console</span>
          </h3>
          <button
            onClick={clearLogs}
            className="text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 select-none outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear console</span>
          </button>
        </div>

        {/* Scrollable logs area */}
        <div className="h-[200px] overflow-y-auto font-mono text-[11px] space-y-2 p-4 rounded-2xl bg-zinc-950/90 dark:bg-zinc-950 text-zinc-300 border border-zinc-200/5 dark:border-zinc-900/80">
          {logs.map((log, index) => {
            let typeColor = "text-zinc-400";
            let typeTag = "[INFO]";

            if (log.type === "warning") {
              typeColor = "text-yellow-500";
              typeTag = "[WARNING]";
            } else if (log.type === "error") {
              typeColor = "text-red-500 font-bold";
              typeTag = "[ERROR]";
            } else if (log.type === "success") {
              typeColor = "text-emerald-500";
              typeTag = "[SUCCESS]";
            }

            return (
              <div key={index} className="flex gap-2.5 items-start leading-relaxed hover:bg-white/5 p-0.5 rounded">
                <span className="text-zinc-600 dark:text-zinc-700 flex-shrink-0 select-none">
                  {log.time}
                </span>
                <span className={`${typeColor} flex-shrink-0 select-none font-bold`}>
                  {typeTag}
                </span>
                <span className="break-all whitespace-normal">
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
