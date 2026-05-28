import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthProvider } from "./providers/AuthContext";
import { ThemeProvider } from "./providers/ThemeContext";
import * as SplashScreen from "expo-splash-screen";
import CustomSplashScreen from "../features/about/screens/SplashScreen";

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Hide the native splash screen as we will show our custom one
    SplashScreen.hideAsync().catch(() => { });
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        {isSplashVisible ? (
          <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />
        ) : (
          <RootNavigator />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
