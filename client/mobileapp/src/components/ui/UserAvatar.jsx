/**
 * @file UserAvatar.jsx
 * @description A reusable UI component that displays user initials in a stylized circular avatar.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * UserAvatar component.
 *
 * Renders a circular avatar containing the uppercase initials of the provided names.
 * Falls back to "AI" if no names are provided.
 *
 * @param {Object} props - Component props
 * @param {string} [props.firstname] - User's first name
 * @param {string} [props.lastname] - User's last name
 * @param {number} [props.size=50] - Diameter of the avatar circle
 * @returns {JSX.Element} The rendered avatar component.
 */
export default function UserAvatar({ firstname, lastname, size = 50 }) {
  const { theme } = useTheme();

  /** Extracts and formats initials from names */
  const getInitials = () => {
    const f = firstname?.trim().charAt(0).toUpperCase() || "";
    const l = lastname?.trim().charAt(0).toUpperCase() || "";
    return `${f}${l}` || "AI";
  };

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.avatarBackground,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.4,
            color: theme.colors.avatarText,
          },
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  initials: {
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
