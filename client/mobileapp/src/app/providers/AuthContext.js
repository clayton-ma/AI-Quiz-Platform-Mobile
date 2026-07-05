/**
 * @file AuthContext.js
 * @description Context provider for managing global authentication state,
 * including user profile data and session persistence.
 */
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

  useEffect(() => {
    /**
     * Initializes authentication state on app mount.
     * Checks for a stored JWT and attempts to restore the user session.
     * @async
     */
    const initAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        if (token) {
          // Fetch profile using the stored token
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
   * @async
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
   * @async
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
 *
 * @returns {Object} Auth context values.
 * @property {Object|null} user - The current authenticated user object.
 * @property {boolean} loading - Loading state for auth initialization or refresh.
 * @property {Function} refreshUser - Function to fetch latest user data from API.
 * @property {Function} clearUser - Function to log out and clear local session.
 */
export const useAuth = () => useContext(AuthContext);
