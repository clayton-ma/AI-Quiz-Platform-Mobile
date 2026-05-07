import { StatusBar } from "expo-status-bar";
import React from "react";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthProvider } from "./providers/AuthContext";
import { ThemeProvider } from "./providers/ThemeContext";

export default function App() {
  return (
     <AuthProvider>
      <ThemeProvider>
        <StatusBar style="light" />

        <RootNavigator />
      </ThemeProvider>
     </AuthProvider>
  );
}
