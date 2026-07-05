/**
 * @file MainContainer.jsx
 * @description A reusable layout wrapper that provides a consistent header and background for all screens.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import MainHeader from "../ui/MainHeader";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * MainContainer component.
 *
 * Wraps screen content with a standard header and theme-aware background.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be rendered inside the container
 * @param {string} [props.title="Available Quizzes"] - The title to display in the header
 * @param {Object} props.navigation - React Navigation object for header actions
 * @param {boolean} [props.isMain=true] - Whether the screen is a top-level tab (hides back button)
 */
export default function MainContainer({
  children,
  title,
  navigation,
  isMain = true,
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <MainHeader
        title={title || "Available Quizzes"}
        isMain={isMain}
        navigation={navigation}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Base container styling */
  container: {
    flex: 1,
  },
});
