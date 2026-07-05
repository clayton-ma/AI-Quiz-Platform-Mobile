/**
 * @file ShowNotification.jsx
 * @description Utility function for displaying system-wide alerts using native dialogs.
 */
import { Alert } from "react-native";

/**
 * ShowNotification
 *
 * Triggers a native platform alert dialog. This serves as a lightweight
 * notification system for providing feedback to the user.
 *
 * @param {Object} params - The notification parameters.
 * @param {string} params.title - The title text of the alert.
 * @param {string} params.message - The body text of the alert.
 */
export default function ShowNotification({ title, message }) {
  Alert.alert(title, message, [{ text: "OK" }]);
}
