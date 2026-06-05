import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { BookOpen, Database, Shield, Zap } from "lucide-react";

export const About = () => {
  const { darkMode } = useTheme();

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15 }
  };

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
      title: "Comic cataloging",
      desc: "Track read status and record episodes for your entire collection in a unified location."
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-500" />,
      title: "Anime customizer",
      desc: "Customize your environment. Choose your favorite active character and watch the app's colors adapt."
    },
    {
      icon: <Database className="w-6 h-6 text-blue-500" />,
      title: "Import / Export tools",
      desc: "Easily backup or transfer catalogs using standard JSON and CSV files with duplicate checks."
    },
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: "NSFW content filters",
      desc: "Safely browse with filters to hide or display mature content depending on your authentication role."
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Brand Header */}
      <div className="p-8 sm:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md text-center relative overflow-hidden shadow-xl">
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-4 uppercase tracking-widest">
          Personal Project
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-none mb-4">
          About Comic Gio
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Comic Gio is a futuristic personal comic manager dashboard designed to keep track of reading progress seamlessly. Tailored with reactive gradients, high performance animations, and anime characters selector.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md flex gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group"
          >
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900/60 h-fit group-hover:scale-105 transition-transform duration-300">
              {feature.icon}
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h4>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Technical details block */}
      <div className="p-6 sm:p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-black/30 backdrop-blur-md font-medium text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 space-y-4">
        <h4 className="font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          ⚙️ Technical Architecture
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200">Frontend Stack</div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              React v19 + Vite + TypeScript. Build optimized client-side SPA.
            </div>
          </div>
          <div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200">Storage & Auth</div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              Supabase backend service. PostgreSQL database and Google OAuth / Anonymous auth.
            </div>
          </div>
          <div>
            <div className="font-bold text-zinc-800 dark:text-zinc-200">Styling & UI</div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              Tailwind CSS v3 + Framer Motion. Smooth GPU accelerated keyframe animations.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
