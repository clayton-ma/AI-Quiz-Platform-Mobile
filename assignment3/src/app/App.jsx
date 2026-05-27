import { StatusBar } from "expo-status-bar";
import React from "react";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthProvider } from "./providers/AuthContext";
import { ThemeProvider } from "./providers/ThemeContext";
import * as SplashScreen from "expo-splash-screen";

// // Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        {/* <Text>SplashScreen Demo! 👋</Text> */}

        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
