/**
 * @file TimerSetting.jsx
 * @description Component for configuring and managing the quiz countdown timer with push notification support.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "@rneui/themed";
import AttemptTimer from "./AttemptTimer";
import { useTheme } from "../../../app/providers/ThemeContext";
import {
  schedulePushNotification,
  registerForPushNotificationsAsync,
} from "../../../components/ui/DeviceNotification";

/**
 * TimerSetting component.
 *
 * Provides an interface for users to set a time limit per question,
 * start the countdown, and receive notifications when time expires.
 *
 * @param {Object} props - Component props
 * @param {number} props.questionCount - Number of questions to calculate total time
 * @param {Function} props.onTimeUp - Callback function triggered when timer reaches zero
 * @returns {JSX.Element} The rendered timer configuration and display.
 */
export default function TimerSetting({ questionCount, onTimeUp }) {
  const { theme } = useTheme();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState("60");

  const handleStart = async () => {
    const secs = parseInt(seconds, 10);
    if (isNaN(secs) || secs <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of seconds.");
      return;
    }
    // Request notification permissions and start timer
    setIsTimerActive(true);
    await registerForPushNotificationsAsync();
  };

  /** Resets the timer to configuration mode */
  const handleReset = () => {
    setIsTimerActive(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: isTimerActive ? "#E74C3C" : theme.colors.primary,
          shadowColor: isTimerActive ? "#E74C3C" : theme.colors.primary,
        },
        styles.container,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Quiz Timer
        </Text>
        {!isTimerActive && (
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={[styles.infoText, { color: theme.dark ? "#999" : "#666" }]}
            >
              Total: {(parseInt(seconds, 10) || 0) * questionCount} secs
            </Text>
            <Text style={[styles.notiHint, { color: theme.colors.primary }]}>
              Please allow notifications
            </Text>
          </View>
        )}
      </View>

      {!isTimerActive ? (
        <View style={styles.configContainer}>
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.text, fontWeight: "600" },
              ]}
            >
              Seconds Per Question:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.dark
                    ? "rgba(255,255,255,0.05)"
                    : "#fff",
                },
              ]}
              keyboardType="decimal-pad"
              value={seconds.replace(/[^0-9]/g, "")}
              onChangeText={setSeconds}
              placeholder="60"
              placeholderTextColor={theme.dark ? "#666" : "#999"}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleStart}
          >
            <Icon name="play-arrow" color="#fff" size={18} />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeContainer}>
          <AttemptTimer
            questionCount={questionCount}
            onTimeUp={() => {
              setIsTimerActive(false);
              schedulePushNotification(
                "Time's Up!",
                "The quiz timer has expired.",
                0,
              );
              if (onTimeUp) onTimeUp();
            }}
            customTimeLimit={(parseInt(seconds, 10) || 60) * questionCount}
          />
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Icon name="refresh" color="#E74C3C" size={18} />
            <Text style={[styles.resetText, { color: "#E74C3C" }]}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderStyle: "dashed",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  notiHint: {
    fontSize: 10,
    fontWeight: "500",
  },
  configContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: 45,
    textAlign: "center",
    fontSize: 14,
  },
  startButton: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  activeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  resetText: {
    fontWeight: "600",
    fontSize: 13,
  },
});
