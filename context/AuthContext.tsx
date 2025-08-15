// README
// Authentication context for managing user login state across the app.
// Features:
// - Stores logged-in user data in AsyncStorage for persistence.
// - Provides login and logout functions to update user state.
// - Restores user session on app startup.
// Notes:
// - User data is stored as JSON in AsyncStorage under the key "loggedInUser".
// - `title` field in User type is optional.
// - All screens that need authentication state should consume this via `useAuth`.

// -------------------- Imports --------------------
import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------- Types --------------------
type User = {
  email: string; // User's email address
  title?: string; // Optional title (Mr., Ms., etc.)
};

type AuthContextType = {
  user: User | null; // Current logged-in user (null if not logged in)
  login: (user: User) => Promise<void>; // Function to log in and store user data
  logout: () => Promise<void>; // Function to log out and clear stored data
  loading: boolean; // Indicates if auth state is still being restored
};

// -------------------- Context Creation --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------- Provider Component --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null); // Current user state
  const [loading, setLoading] = useState(true); // Loading state while restoring session

  // Restore user session from AsyncStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      if (storedUser) setUser(JSON.parse(storedUser)); // Parse stored JSON user data
      setLoading(false);
    };
    loadUser();
  }, []);

  // Store user data in AsyncStorage and update state
  const login = async (userData: User) => {
    await AsyncStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Clear user data from AsyncStorage and reset state
  const logout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    setUser(null);
  };

  // Provide auth state and functions to children
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// -------------------- Hook for Consuming Auth Context --------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
