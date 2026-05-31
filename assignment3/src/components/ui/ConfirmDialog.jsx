/**
 * @file ConfirmDialog.jsx
 * @description A reusable modal dialog for user confirmation actions with theme support.
 */
import React from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Button } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * ConfirmDialog component.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the dialog is visible.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.message - The message body.
 * @param {function} props.onConfirm - Callback when confirm is pressed.
 * @param {function} props.onCancel - Callback when cancel is pressed.
 * @param {string} [props.confirmText="Confirm"] - Text for the confirm button.
 * @param {string} [props.cancelText="Cancel"] - Text for the cancel button.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={[styles.dialog, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              { color: theme.dark ? "#909296" : "#7F8C8D" },
            ]}
          >
            {message}
          </Text>
          <View style={styles.actions}>
            <Button
              title={cancelText}
              type="clear"
              onPress={onCancel}
              titleStyle={{ color: "#7F8C8D" }}
            />
            <Button
              title={confirmText}
              onPress={onConfirm}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    width: "85%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: { fontSize: 16, marginBottom: 20 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});
