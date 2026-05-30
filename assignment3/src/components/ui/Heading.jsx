import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * Heading component for authentication screens.
 * Displays a title and a clickable link for navigation between auth states.
 *
 * @param {string} title - The main heading text
 * @param {string} linkText - The descriptive text before the link
 * @param {string} linkActionText - The clickable link text
 * @param {Function} onLinkPress - Callback function when the link is pressed
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  linkText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
  link: {
    fontWeight: "600",
  },
});
