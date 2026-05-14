import React from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import { BackgroundColor } from "../../../constants";

/**
 * A reusable confirmation dialog component.
 *
 * @param {boolean} visible - Whether the dialog is visible.
 * @param {string} title - The title of the dialog.
 * @param {string} message - The message body.
 * @param {function} onConfirm - Callback when confirm is pressed.
 * @param {function} onCancel - Callback when cancel is pressed.
 * @param {string} confirmText - Text for the confirm button.
 * @param {string} cancelText - Text for the cancel button.
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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
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
                backgroundColor: BackgroundColor,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>
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
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2C3E50",
  },
  message: { fontSize: 16, color: "#7F8C8D", marginBottom: 20 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
