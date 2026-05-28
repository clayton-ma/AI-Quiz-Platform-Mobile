import { Alert } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

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
  // Note: This utility must be called within a React component or hook 
  // where the ThemeProvider is available.
  try {
    const { theme } = useTheme();
    // Native Alert doesn't support direct color styling of the message body,
    // but we ensure the context is available for future custom UI implementations.
  } catch (e) {}

  Alert.alert(title, message, [{ text: "OK" }]);
}
