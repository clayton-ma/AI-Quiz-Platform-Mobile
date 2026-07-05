/**
 * @file MainHeader.jsx
 * @description A reusable header component that integrates with React Navigation and the application theme.
 */
import React from "react";
import { Header } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * MainHeader component.
 *
 * Renders a consistent top navigation bar. It supports two modes:
 * 1. Main mode: Displays only the title (used for top-level screens).
 * 2. Sub-screen mode: Displays a back button and the title.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object used for the back action
 * @param {boolean} props.isMain - Determines if the back button should be hidden
 * @param {string} props.title - The text to display in the center of the header
 * @returns {JSX.Element} The rendered header component.
 */
export default function MainHeader({ navigation, isMain, title }) {
  const { theme } = useTheme();

  if (isMain) {
    return (
      <Header
        containerStyle={{
          backgroundColor: theme.colors.primary,
        }}
        centerComponent={{
          text: title,
          style: { color: "#fff", fontWeight: "bold" },
        }}
      />
    );
  }

  return (
    <Header
      containerStyle={{
        backgroundColor: theme.colors.primary,
        borderBottomWidth: 0,
      }}
      leftComponent={{
        icon: "arrow-back",
        type: "material",
        color: "#fff",
        size: 30,
        onPress: () => navigation.goBack(),
      }}
      centerComponent={{
        text: title,
        style: { color: "#fff", fontWeight: "bold" },
      }}
    />
  );
}
