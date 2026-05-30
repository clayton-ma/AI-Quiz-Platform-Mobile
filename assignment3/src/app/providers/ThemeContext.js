import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

const ThemeContext = createContext();

/**
 * ThemeProvider manages the application's color scheme.
 * Supports 'light', 'dark', and 'system' (following device settings).
 */
export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system"); // 'light' | 'dark' | 'system'

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync("theme_preference");
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {}
    };
    loadTheme();
  }, []);

  /**
   * Updates the theme mode and persists it to SecureStore.
   * @param {string} mode - The desired mode ('light', 'dark', or 'system')
   */
  const updateThemeMode = async (mode) => {
    setThemeMode(mode);
    try {
      await SecureStore.setItemAsync("theme_preference", mode);
    } catch (error) {}
  };

  // Determine the active theme based on mode and device settings
  const isDark =
    themeMode === "system"
      ? deviceColorScheme === "dark"
      : themeMode === "dark";

  // const isDark = true;

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
 * @returns {Object} { theme, themeMode, updateThemeMode }
 */
export const useTheme = () => useContext(ThemeContext);
