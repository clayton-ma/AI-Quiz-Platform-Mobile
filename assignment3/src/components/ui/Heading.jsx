/**
 * @file Heading.jsx
 * @description A reusable heading component for authentication and onboarding screens.
 */
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * Heading component.
 * Displays a prominent title and a secondary navigation link for switching between related screens (e.g., Login to Register).
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The main heading text
 * @param {string} props.linkText - The descriptive text before the link
 * @param {string} props.linkActionText - The clickable link text
 * @param {Function} props.onLinkPress - Callback function when the link is pressed
 */
export default function Heading({
  title,
  linkText,
  linkActionText,
  onLinkPress,
}) {
  const { theme } = useTheme();

  return (
    <>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <TouchableOpacity onPress={onLinkPress}>
        <Text style={styles.linkText}>
          {linkText}{" "}
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            {linkActionText}
          </Text>
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  /** Main title styling */
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  /** Secondary text styling */
  linkText: { textAlign: "center", marginTop: 10, color: "#666" },
  /** Actionable link styling */
  link: { fontWeight: "600" },
});
