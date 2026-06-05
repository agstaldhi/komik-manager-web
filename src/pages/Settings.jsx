import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle, Download, FileJson, FileSpreadsheet, Play, Trash2, Upload } from "lucide-react";
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

  // CSV parser
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return [];
    
    // Parse headers
    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split line by commas, respecting quotes
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
      const row = {};

      headers.forEach((header, index) => {
        let val = matches[index] ? matches[index].trim() : "";
        // Unquote
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
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

    const validComics = [];
    let duplicateCount = 0;
    
    // Populate the set with all title variants (main and alt) from the database
    const dbTitles = new Set();
    comics.forEach(c => {
      getTitlesList(c.title).forEach(t => dbTitles.add(t));
    });

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

      // Check all parsed title variations against the registered titles set
      const newTitlesList = getTitlesList(title);
      const isDuplicate = newTitlesList.some(t => dbTitles.has(t));

      if (isDuplicate) {
        duplicateCount++;
        addLog("warning", `Duplicate detected: "${title}" is already in database or import file. Skipped.`);
      } else {
        // Add new titles to the set to prevent duplicates in the same file
        newTitlesList.forEach(t => dbTitles.add(t));
        validComics.push({
          title,
          episode,
          link,
          isNSFW,
          thumbnail
        });
      }
    });

    if (validComics.length === 0) {
      addLog("warning", `Import process stopped: 0 new comics out of ${rawData.length} rows. All were skipped/duplicates.`);
      showNotification("Tidak ada komik baru yang diimport (semua duplikat/invalid)!", "error");
      return;
    }

    addLog("info", `Uploading ${validComics.length} new comics to database...`);
    const result = await bulkUpload(validComics);

    if (result.success) {
      addLog("success", `Successfully imported ${validComics.length} comics into Supabase database.`);
      showNotification(result.message, "success");
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
      const csvRows = ["Title,Episode,Link,isNSFW,Thumbnail"];
      
      comics.forEach(c => {
        // Escape quotes and commas in Title
        const escapedTitle = `"${c.title.replace(/"/g, '""')}"`;
        const escapedLink = `"${c.link.replace(/"/g, '""')}"`;
        const escapedCover = `"${(c.thumbnail || "").replace(/"/g, '""')}"`;
        csvRows.push(`${escapedTitle},${c.episode},${escapedLink},${c.isNSFW},${escapedCover}`);
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
