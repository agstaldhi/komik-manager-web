import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuest(currentUser.isAnonymous);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsGuest(false);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { success: false, error: error.message };
    }
  };

  // Guest Mode (Anonymous)
  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
      setIsGuest(true);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Error signing in as guest:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsGuest(false);
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isGuest,
    isAuthenticated: !!user && !user.isAnonymous, // True jika login dengan Google
    canEdit: !!user && !user.isAnonymous, // Hanya user authenticated bisa edit
    showNSFW: !!user && !user.isAnonymous, // Hanya user authenticated bisa lihat NSFW
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
