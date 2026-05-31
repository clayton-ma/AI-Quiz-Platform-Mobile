/**
 * @file RootNavigator.jsx
 * @description The top-level navigation component that manages the authentication state and routing.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../providers/AuthContext";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

/**
 * RootNavigator component.
 *
 * This component acts as the entry point for the application's navigation structure.
 * It monitors the user's authentication status from the AuthContext and conditionally
 * renders either the TabNavigator (for authenticated users) or the AuthNavigator
 * (for guests/unauthenticated users).
 *
 * @returns {JSX.Element} The root navigation container of the application.
 */
export function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
