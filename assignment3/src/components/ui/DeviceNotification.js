/**
 * @file DeviceNotification.js
 * @description Utility for managing local and push notifications using Expo Notifications.
 * Includes permission handling, token registration, and notification scheduling.
 */
import { useEffect } from "react";
import { Platform, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

/**
 * Configures the global notification handler for the app.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Hook to observe and handle user interactions with notifications.
 * Supports deep linking if a URL is provided in the notification data.
 */
export function useNotificationObserver() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { data } = response.notification.request.content;

        // Example: Handle deep linking or internal navigation based on data
        if (data.url) {
          Linking.openURL(data.url);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

/**
 * Schedules a local notification.
 *
 * @param {string} title - The title of the notification.
 * @param {string} body - The message body.
 * @param {number} [delay=0] - Delay in seconds before showing the notification.
 * @param {Object} [data={}] - Additional metadata for the notification.
 */
export async function schedulePushNotification(
  title,
  body,
  delay = 0,
  data = {},
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data,
    },
    trigger:
      delay > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delay,
          }
        : null,
  });
}

/**
 * Requests notification permissions and retrieves the Expo Push Token.
 *
 * @returns {Promise<string|undefined>} The push token or an error message string.
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    // Simulator/Emulator doesn't support Expo push tokens,
    // but we can still request local notification permissions.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  }

  return token;
}
