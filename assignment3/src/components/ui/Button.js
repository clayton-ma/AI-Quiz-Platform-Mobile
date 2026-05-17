import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * A reusable SaveButton component with a loading state.
 *
 * @param {boolean} loading - Shows an activity indicator when true.
 * @param {function} onPress - Function to call on button press.
 * @param {string} title - Text to display on the button.
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
        type === "outline" ? { color: color } : styles.saveButtonTitle
      }
    />
  );
};

const styles = StyleSheet.create({
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
  },
});
