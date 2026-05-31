/**
 * @file Button.jsx
 * @description Reusable button components styled for the application theme.
 */
import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * A reusable SaveButton component with a loading state.
 * Typically used for form submissions and profile updates.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Shows an activity indicator when true
 * @param {Function} props.onPress - Function to call on button press
 * @param {string} [props.title="Save Changes"] - Text to display on the button
 */
export const SaveButton = ({ loading, onPress, title = "Save Changes" }) => {
  const { theme } = useTheme();

  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      buttonStyle={[
        styles.saveButton,
        { backgroundColor: theme.colors.primary },
      ]}
      titleStyle={styles.saveButtonTitle}
      disabled={loading}
      loadingProps={<ActivityIndicator color="#fff" />}
    />
  );
};

/**
 * A reusable ActionButton for secondary actions.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Text to display on the button
 * @param {Function} props.onPress - Function to call on button press
 * @param {Object} [props.icon] - Icon component or configuration
 * @param {string} [props.color] - Custom color for the button
 * @param {string} [props.type="solid"] - Button type ('solid' | 'clear' | 'outline')
 */
export const ActionButton = ({
  title,
  onPress,
  icon,
  color,
  type = "solid",
}) => {
  const { theme } = useTheme();
  const activeColor = color || theme.colors.primary;

  return (
    <Button
      title={title}
      onPress={onPress}
      icon={icon}
      type={type}
      buttonStyle={[
        styles.actionButton,
        type === "solid" && { backgroundColor: activeColor },
        type === "outline" && { borderColor: activeColor },
      ]}
      titleStyle={
        type === "outline" ? { color: activeColor } : styles.saveButtonTitle
      }
    />
  );
};

const styles = StyleSheet.create({
  saveButton: {
    /** Primary action button styling */
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonTitle: {
    /** Text styling for primary buttons */
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButton: {
    /** Secondary action button styling */
    borderRadius: 8,
    paddingHorizontal: 20,
  },
});
