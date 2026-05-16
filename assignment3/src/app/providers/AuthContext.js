import { createContext, useContext, useState, useEffect } from "react";
import ShowErrorNotification from "../../components/ui/ShowErrorNotification";
import { fetchUser } from "../../features/user/services/userApi";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application and provides authentication state.
 * It manages the current user object, loading status, and authentication methods.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial mount, check if a JWT exists and attempt to fetch user details
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check SecureStore for existing token to restore session
        const token = await SecureStore.getItemAsync("jwt");
        if (token) {
          const loginedUser = await fetchUser();
          if (loginedUser) setUser(loginedUser);
        } else {
          await clearUser();
        }
      } catch (errors) {
        await SecureStore.deleteItemAsync("jwt");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  /**
   * Refreshes the user state from the server.
   * Called after a successful login API call has stored the JWT.
   */
  const refreshUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        const freshUser = await fetchUser();
        if (freshUser) setUser(freshUser);
      } else {
        await clearUser();
      }
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears the authentication state and removes the JWT from SecureStore.
   */
  const clearUser = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, refreshUser, clearUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 * Provides { user, refreshUser, clearAuth, loading }.
 *
 * @returns {Object} Authentication context value
 */
export const useAuth = () => useContext(AuthContext);
