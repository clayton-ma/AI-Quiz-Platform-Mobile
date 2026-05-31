/**
 * @file ThemeContext.js
 * @description Context provider for managing the application's theme state,
 * supporting light, dark, and system-based color schemes with persistence.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

const ThemeContext = createContext();

/**
 * ThemeProvider component that wraps the application to provide theme state.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 */
export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  /** @type {['light'|'dark'|'system', Function]} */
  const [themeMode, setThemeMode] = useState("system");

  /**
   * Initializes the theme state on app mount.
   * Retrieves the user's saved theme preference from SecureStore.
   * @async
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync("theme_preference");
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference", error);
      }
    };
    loadTheme();
  }, []);

  /**
   * Updates the theme mode state and persists the choice to SecureStore.
   * @param {string} mode - The desired mode ('light', 'dark', or 'system')
   */
  const updateThemeMode = async (mode) => {
    setThemeMode(mode);
    try {
      await SecureStore.setItemAsync("theme_preference", mode);
    } catch (error) {}
  };

  // Calculate whether the dark theme should be active
  const isDark =
    themeMode === "system"
      ? deviceColorScheme === "dark"
      : themeMode === "dark";

  /** @type {Object} The theme configuration object containing color palettes */
  const theme = {
    dark: isDark,
    colors: {
      background: isDark ? "#1A1B1E" : "#FFFFFF",
      text: isDark ? "#C1C2C5" : "#2C3E50",
      card: isDark ? "#25262B" : "#F8F9FA",
      border: isDark ? "#373A40" : "#DEE2E6",
      primary: "#228be6",
      tabActiveColor: "#228be6",
      tabBarBackground: isDark ? "#1A1B1E" : "#FFFFFF",
      tabBarText: isDark ? "#C1C2C5" : "#2C3E50",
      tabInactiveColor: isDark ? "#909296" : "#adb5bd",
      avatarBackground: isDark ? "#228be6" : "#000000",
      avatarText: "#FFFFFF",
      textInputBackground: isDark ? "#25262B" : "#F8F9FA",
      textInputBorder: isDark ? "#373A40" : "#DEE2E6",
      textInputText: isDark ? "#C1C2C5" : "#2C3E50",
      alertButtonBackground: isDark ? "rgba(250, 82, 82, 0.1)" : "#fff0f0",
      alertButtonText: isDark ? "#fa5252" : "#fa5252",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, updateThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme and theme-switching logic.
 *
 * @returns {Object} Theme context values.
 * @property {Object} theme - The current theme object containing colors and dark mode flag.
 * @property {string} themeMode - The user's preferred mode ('light', 'dark', or 'system').
 * @property {Function} updateThemeMode - Function to change and persist the theme mode.
 */
export const useTheme = () => useContext(ThemeContext);
