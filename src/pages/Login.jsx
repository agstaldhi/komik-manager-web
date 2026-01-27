import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? "bg-black" : "bg-gray-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-xl border-2 ${
          darkMode
            ? "bg-black/50 border-green-500 shadow-2xl shadow-green-500/20"
            : "bg-white border-gray-300 shadow-xl"
        }`}
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              darkMode ? "text-green-400" : "text-gray-800"
            }`}
          >
            <span className={darkMode ? "text-green-500" : "text-green-600"}>
              COMIC
            </span>{" "}
            MANAGER
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-green-300" : "text-gray-600"
            }`}
          >
            Manage your comic collection
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg border-2 font-bold transition-all flex items-center justify-center gap-3 mb-4 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : darkMode
              ? "border-green-500 bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/50"
              : "border-green-600 bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${
                darkMode ? "border-green-500/30" : "border-gray-300"
              }`}
            />
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-4 ${
                darkMode ? "bg-black text-green-300" : "bg-white text-gray-600"
              }`}
            >
              OR
            </span>
          </div>
        </div>

        {/* Guest Mode Button */}
        <button
          onClick={handleGuestMode}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg border-2 font-medium transition-all ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : darkMode
              ? "border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          👤 Continue as Guest
        </button>

        {/* Guest Mode Info */}
        <div
          className={`mt-6 p-4 rounded-lg border ${
            darkMode
              ? "border-green-500/30 bg-black/50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-green-300" : "text-gray-600"
            } mb-2`}
          >
            <strong>Guest Mode Restrictions:</strong>
          </p>
          <ul
            className={`text-xs ${
              darkMode ? "text-green-300" : "text-gray-600"
            } space-y-1`}
          >
            <li>• View-only access</li>
            <li>• Cannot add, edit, or delete comics</li>
            <li>• NSFW content hidden</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
