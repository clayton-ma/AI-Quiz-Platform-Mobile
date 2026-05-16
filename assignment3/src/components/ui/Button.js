import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
// import { BackgroundColor } from "../../constants";

const BackgroundColor="white"

/**
 * A reusable SaveButton component with a loading state.
 * 
 * @param {boolean} loading - Shows an activity indicator when true.
 * @param {function} onPress - Function to call on button press.
 * @param {string} title - Text to display on the button.
 */
export const SaveButton = ({ loading, onPress, title = "Save Changes" }) => {
  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      buttonStyle={styles.saveButton}
      titleStyle={styles.saveButtonTitle}
      disabled={loading}
      loadingProps={<ActivityIndicator color="#fff" />}
    />
  );
};

/**
 * A reusable ActionButton for secondary actions.
 */
export const ActionButton = ({ title, onPress, icon, color = BackgroundColor, type = "solid" }) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      icon={icon}
      type={type}
      buttonStyle={[
        styles.actionButton,
        type === "solid" && { backgroundColor: color },
        type === "outline" && { borderColor: color }
      ]}
      titleStyle={type === "outline" ? { color: color } : styles.saveButtonTitle}
    />
  );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: BackgroundColor,
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