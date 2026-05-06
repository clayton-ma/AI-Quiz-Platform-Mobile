import { Alert } from "react-native";

/**
 * Displays a native alert notification.
 * Adapted for React Native from Mantine notifications.
 *
 * @param {Object} params - The notification parameters.
 * @param {string} params.id - Unique identifier (unused in native Alert).
 * @param {string} params.title - The title text of the notification.
 * @param {string} params.message - The body text of the notification.
 * @param {"error" | "success" | "info"} params.type - The type of notification.
 */
export default function ShowNotification({ id, title, message, type }) {
  // React Native uses Alert.alert for simple notifications
  Alert.alert(title, message, [{ text: "OK" }]);
}
