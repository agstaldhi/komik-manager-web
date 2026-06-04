import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsGuest(session.user.is_anonymous || false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsGuest(session.user.is_anonymous || false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Google Sign In (Supabase OAuth Redirect)
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { success: false, error: error.message };
    }
  };

  // Guest Mode (Supabase Anonymous Sign In)
  const signInAsGuest = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setUser(data.user);
      setIsGuest(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Error signing in as guest:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign Out (Supabase)
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
    isAuthenticated: !!user && !user.is_anonymous, // True jika login dengan Google
    canEdit: !!user && !user.is_anonymous, // Hanya user authenticated bisa edit
    showNSFW: !!user && !user.is_anonymous, // Hanya user authenticated bisa lihat NSFW
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
