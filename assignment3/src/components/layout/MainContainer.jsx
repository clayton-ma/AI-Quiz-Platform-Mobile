import React from "react";
import { View, StyleSheet } from "react-native";
import MainHeader from "../ui/MainHeader";
import { useTheme } from "../../app/providers/ThemeContext";

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
  container: {
    flex: 1,
  },
});
