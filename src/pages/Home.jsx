import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Calendar, Clock, Eye, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

// Assets
import gojo from "../assets/Gojo Satoru.webp";
import kaneki from "../assets/Ken Kaneki.webp";
import luffy from "../assets/Monkey D Luffy.webp";
import nezuko from "../assets/Nezuko.webp";
import rimuru from "../assets/Rimuru Tempest.webp";
import jinwoo from "../assets/Sung Jin Woo.webp";
import killua from "../assets/Killua.webp";
import saitama from "../assets/Saitama.webp";

const CHARACTERS = [
  {
    name: "Gojo Satoru",
    anime: "Jujutsu Kaisen",
    desc: "“Don't worry, I'm the strongest. Throughout Heaven and Earth, I alone am the honored one. Domain Expansion: Infinite Void.”",
    image: gojo,
    gradient: "from-blue-600/25 via-indigo-600/20 to-purple-600/25",
    glow: "shadow-blue-500/20 dark:shadow-indigo-500/20",
    border: "border-indigo-500/30 dark:border-indigo-400/50",
    textColor: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-indigo-500",
  },
  {
    name: "Rimuru Tempest",
    anime: "Reincarnated as a Slime",
    desc: "“I'm not a bad slime, you know! Let's build a nation where everyone, humans and monsters alike, can live in peaceful harmony.”",
    image: rimuru,
    gradient: "from-sky-500/25 via-cyan-500/20 to-blue-500/25",
    glow: "shadow-sky-500/20 dark:shadow-sky-500/20",
    border: "border-sky-500/30 dark:border-sky-400/50",
    textColor: "text-sky-600 dark:text-sky-400",
    accentBg: "bg-sky-500",
  },
  {
    name: "Monkey D. Luffy",
    anime: "One Piece",
    desc: "“I'm going to be the Pirate King! If you don't take risks, you can't create a future! I don't want to conquer anything, I just want to be free.”",
    image: luffy,
    gradient: "from-orange-500/25 via-amber-500/20 to-red-500/25",
    glow: "shadow-orange-500/20 dark:shadow-orange-500/20",
    border: "border-orange-500/30 dark:border-orange-400/50",
    textColor: "text-orange-600 dark:text-orange-400",
    accentBg: "bg-orange-500",
  },
  {
    name: "Sung Jin Woo",
    anime: "Solo Leveling",
    desc: "“Arise. From this moment on, you shall serve me as my shadows. If the system wants me to kill, I will kill. If I have to become a monster, I will.”",
    image: jinwoo,
    gradient: "from-purple-800/25 via-indigo-950/20 to-slate-900/25",
    glow: "shadow-purple-700/20 dark:shadow-purple-500/20",
    border: "border-purple-600/30 dark:border-purple-500/50",
    textColor: "text-purple-600 dark:text-purple-400",
    accentBg: "bg-purple-600",
  },
  {
    name: "Ken Kaneki",
    anime: "Tokyo Ghoul",
    desc: "“What's wrong isn't me... what's wrong is this world. If you write a story with me in the lead, it would certainly be a tragedy.”",
    image: kaneki,
    gradient: "from-red-600/25 via-zinc-800/20 to-neutral-900/25",
    glow: "shadow-red-500/20 dark:shadow-red-500/20",
    border: "border-red-500/30 dark:border-red-400/50",
    textColor: "text-red-600 dark:text-red-400",
    accentBg: "bg-red-600",
  },
  {
    name: "Nezuko Kamado",
    anime: "Demon Slayer",
    desc: "“Mmh! Mmh! (Humans are to be protected and saved... I will never hurt them, and I will protect Tanjiro and everyone no matter what!)”",
    image: nezuko,
    gradient: "from-rose-500/25 via-pink-500/20 to-rose-400/25",
    glow: "shadow-rose-500/20 dark:shadow-rose-500/20",
    border: "border-rose-400/30 dark:border-rose-400/50",
    textColor: "text-rose-600 dark:text-rose-400",
    accentBg: "bg-rose-500",
  },
  {
    name: "Killua Zoldyck",
    anime: "Hunter x Hunter",
    desc: "“If I ignore a friend I have the ability to help, wouldn't I be betraying him? Gon... you are light itself. Sometimes, you shine so brightly, I must look away.”",
    image: killua,
    gradient: "from-indigo-500/25 via-blue-500/20 to-slate-400/25",
    glow: "shadow-indigo-500/20 dark:shadow-indigo-500/20",
    border: "border-indigo-400/30 dark:border-indigo-400/50",
    textColor: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-indigo-500",
  },
  {
    name: "Saitama",
    anime: "One Punch Man",
    desc: "“I'm just a guy who's a hero for fun. In exchange for gaining this power, have I lost something essential to being human? One punch is all it takes.”",
    image: saitama,
    gradient: "from-yellow-500/20 via-amber-600/15 to-red-500/20",
    glow: "shadow-yellow-500/20 dark:shadow-yellow-500/20",
    border: "border-yellow-400/30 dark:border-yellow-400/50",
    textColor: "text-yellow-600 dark:text-yellow-400",
    accentBg: "bg-yellow-500",
  }
];

export const Home = ({ comics, onNavigate }) => {
  const { darkMode } = useTheme();
  const { showNSFW } = useAuth();
  const [activeCharIndex, setActiveCharIndex] = useState(0);

  const activeChar = CHARACTERS[activeCharIndex];

  // ⬇️ Sorting comics for "Recent Comic" (artwork)
  const sortedComics = useMemo(() => {
    return [...comics].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB - dateA;
    });
  }, [comics]);

  const recentComics = sortedComics.slice(0, 4);

  // ⬇️ Calculate metrics
  const stats = useMemo(() => {
    const total = comics.length;
    const nsfwCount = comics.filter((c) => c.isNSFW).length;
    const normalCount = total - nsfwCount;

    // Added in last 1 week (7 days)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const addedWeek = comics.filter((c) => {
      const updatedTime = c.updatedAt ? new Date(c.updatedAt).getTime() : 0;
      return updatedTime >= oneWeekAgo;
    }).length;

    // Added in last 1 month (30 days)
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const addedMonth = comics.filter((c) => {
      const updatedTime = c.updatedAt ? new Date(c.updatedAt).getTime() : 0;
      return updatedTime >= oneMonthAgo;
    }).length;

    return { total, normalCount, nsfwCount, addedWeek, addedMonth };
  }, [comics]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short"
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full space-y-8 pb-12"
    >
      {/* 1. Large Hero Banner (Adaptive Gradient per character) */}
      <div 
        className={motion.div}
        style={{ contentVisibility: "auto" }}
      >
        <div 
          className={`relative rounded-[2.5rem] border glass-panel p-8 sm:p-12 min-h-[380px] lg:min-h-[420px] flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-700 bg-gradient-to-br ${activeChar.gradient} ${activeChar.border} ${activeChar.glow}`}
        >
          {/* Neon back glow circles inside the hero banner */}
          <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${activeChar.accentBg}`} />
          
          {/* Header Tag */}
          <div className="relative z-10 flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-500 dark:text-zinc-400">
              {activeChar.anime}
            </span>
          </div>

          {/* Hero text details */}
          <div className="relative z-10 w-full lg:w-[60%] flex-1 flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCharIndex}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-zinc-900 dark:text-zinc-50">
                  {activeChar.name}
                </h2>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
                  {activeChar.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider indicator dots */}
          <div className="relative z-10 flex items-center gap-2.5 mt-6 pl-2">
            {CHARACTERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCharIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 outline-none ${
                  idx === activeCharIndex 
                    ? `w-8 ${activeChar.accentBg}` 
                    : "w-2.5 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700"
                }`}
                title={`View ${CHARACTERS[idx].name}`}
              />
            ))}
          </div>

          {/* Character Popout Image */}
          <div 
            className="absolute bottom-0 right-0 w-[45%] h-[95%] hidden lg:block z-10 select-none pointer-events-none"
            style={{
              WebkitMaskImage: "linear-gradient(to top, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%)",
              maskImage: "linear-gradient(to top, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCharIndex}
                src={activeChar.image}
                alt={activeChar.name}
                className="absolute bottom-0 right-8 w-auto h-[105%] object-contain object-bottom will-change-transform drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. Content Layout (Inspired by download.jfif) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Comic (replaces Artwork >) - Spans 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span>Recent Comics</span>
            </h3>
            <button 
              onClick={() => onNavigate("list")}
              className="text-xs font-bold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 select-none outline-none group"
            >
              <span>View All</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentComics.length > 0 ? (
              recentComics.map((comic) => (
                <a
                  key={comic.id}
                  href={comic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-950/60 hover:-translate-y-0.5 hover:shadow-lg border-l-4 hover:border-l-emerald-500 transition-all duration-300 flex gap-4 select-none items-center"
                >
                  {comic.thumbnail ? (
                    <img
                      src={comic.thumbnail}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-xl shadow-md flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center text-xl flex-shrink-0">
                      📖
                    </div>
                  )}
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate group-hover:underline">
                        {(comic.title || "").split("|")[0].trim()}
                      </div>
                      {comic.isNSFW && (
                        <span className="px-1 py-0.5 text-[8px] font-black rounded bg-red-500 text-white flex-shrink-0">
                          18+
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[11px] font-bold text-emerald-500 mt-1">
                      Episode {comic.episode}
                    </div>

                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(comic.updatedAt)}</span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-sm text-zinc-400">
                No comics added yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chibi Avatars + Metrics Panel - Spans 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="px-2">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Metrics & Dashboard</span>
            </h3>
          </div>

          <div className="p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Box: Interactive Chibi Faces selector - Spans 5 cols on md */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 text-center">
                Select Active Sorcerer
              </div>

              {/* Chibi circular grid */}
              <div className="grid grid-cols-4 gap-3 max-w-[200px]">
                {CHARACTERS.map((char, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCharIndex(index)}
                    className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 outline-none select-none ${
                      index === activeCharIndex
                        ? `border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20`
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-105"
                    }`}
                    title={char.name}
                  >
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {index === activeCharIndex && (
                      <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-bold text-center mt-4 text-zinc-500 dark:text-zinc-400">
                Active: <span className="text-emerald-500">{activeChar.name}</span>
              </div>
            </div>

            {/* Right Box: Counters & Stats - Spans 7 cols on md */}
            <div className="md:col-span-7 grid grid-cols-2 gap-4">
              
              {/* Stat 1: Total All Comics */}
              <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  Total Comics
                </div>
                <div className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-1">
                  {stats.total}
                </div>
              </div>

              {/* Stat 2: Normal Comics */}
              <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Normal</span>
                </div>
                <div className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-1">
                  {stats.normalCount}
                </div>
              </div>

              {/* Stat 3: NSFW Comics */}
              <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>NSFW (18+)</span>
                </div>
                <div className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-1">
                  {showNSFW ? stats.nsfwCount : "Hidden"}
                </div>
              </div>

              {/* Stat 4: Last 7 Days Addition */}
              <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40">
                <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-500" />
                  <span>New Weekly</span>
                </div>
                <div className="text-3xl font-black text-emerald-500 mt-1">
                  +{stats.addedWeek}
                </div>
              </div>

              {/* Stat 5: Last Month Addition */}
              <div className="p-4 col-span-2 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                    New Added (Last 30 Days)
                  </div>
                  <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100 mt-0.5">
                    +{stats.addedMonth} comics
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
