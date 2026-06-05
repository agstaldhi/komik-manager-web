import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { AuroraBackground } from "../components/AuroraBackground";
import { SparklesText } from "../components/SparklesText";

export const Login = () => {
  const { darkMode } = useTheme();
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGuestMode = async () => {
    setLoading(true);
    setError("");
    const result = await signInAsGuest();
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <AuroraBackground className="justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 sm:p-10 rounded-[2rem] border glass-panel shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Decorative ambient glows inside card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo/Title */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex justify-center mb-3">
            <SparklesText 
              text="Comic Gio" 
              className="text-4xl sm:text-5xl font-black tracking-tight"
              colors={{ first: "#10b981", second: "#6366f1" }}
              sparklesCount={8}
            />
          </div>
          <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Manage your personal comic collection in style
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-4 relative z-10">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-3 select-none ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-zinc-950 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-zinc-200 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{loading ? "Connecting..." : "Sign in with Google"}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
            <span className="mx-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              OR
            </span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
          </div>

          {/* Guest Mode Button */}
          <button
            onClick={handleGuestMode}
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 select-none ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 active:scale-[0.98]"
            }`}
          >
            <span>👤</span>
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Guest Mode Info */}
        <div className="mt-8 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/30 relative z-10">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
            Guest Mode Restrictions:
          </p>
          <ul className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 space-y-1">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>View-only access for general catalog</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>Adding, editing, and deleting are disabled</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>NSFW marked items will be hidden</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </AuroraBackground>
  );
};
