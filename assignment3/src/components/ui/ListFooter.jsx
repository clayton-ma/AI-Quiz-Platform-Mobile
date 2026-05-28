import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext"

export default function ListFooter({ loading, refreshing }) {
  const { theme } = useTheme();
  if (!loading || refreshing) return null;
  return (
    <ActivityIndicator
      style={{ marginVertical: 20 }}
      size="small"
      color={theme.colors.primary}
    />
  );
}
