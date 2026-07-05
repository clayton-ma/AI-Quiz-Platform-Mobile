/**
 * @file ListFooter.jsx
 * @description A reusable footer component for FlatList to show loading indicators during pagination.
 */
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * ListFooter component.
 *
 * Renders a loading spinner at the bottom of a list when fetching more data.
 * It automatically hides if the list is currently performing a pull-to-refresh.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Indicates if more data is being loaded
 * @param {boolean} props.refreshing - Indicates if the list is currently refreshing
 * @returns {JSX.Element|null} The rendered activity indicator or null.
 */
export default function ListFooter({ loading, refreshing }) {
  const { theme } = useTheme();

  if (!loading || refreshing) return null;

  return (
    <ActivityIndicator
      style={styles.loader}
      size="small"
      color={theme.colors.primary}
    />
  );
}

const styles = StyleSheet.create({
  /** Styling for the footer loader */
  loader: { marginVertical: 20 },
});
