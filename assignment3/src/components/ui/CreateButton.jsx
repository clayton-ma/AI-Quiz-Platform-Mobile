/**
 * @file CreateButton.jsx
 * @description A reusable Floating Action Button (FAB) for triggering creation actions.
 */
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * CreateButton component.
 *
 * Renders a circular button fixed to the bottom-right of the screen,
 * typically used for "Add" or "Create" operations.
 *
 * @param {Object} props - Component props
 * @param {Function} props.handlePress - Callback function triggered on button press
 */
export default function CreateButton({ handlePress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      onPress={handlePress}
    >
      <Icon name="add" color="#fff" size={30} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /** Floating action button positioning and elevation */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
