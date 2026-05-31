/**
 * @file AttemptTimer.jsx
 * @description A visual countdown timer component for quiz attempts with dynamic color coding based on remaining time.
 */
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * AttemptTimer component.
 *
 * @param {Object} props - Component props
 * @param {number} [props.questionCount=0] - Used to calculate default time if no limit provided
 * @param {Function} props.onTimeUp - Callback triggered when the timer hits zero
 * @param {number} [props.customTimeLimit] - Optional specific time limit in seconds
 * @param {number} [props.minutesPerQuestion=2] - Default minutes allocated per question
 */
export default function AttemptTimer({
  questionCount = 0,
  onTimeUp,
  customTimeLimit,
  minutesPerQuestion = 2,
}) {
  const { theme } = useTheme();

  // Calculate total seconds: custom limit or (questions * minutes * 60)
  const initialSeconds =
    customTimeLimit || questionCount * minutesPerQuestion * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const timerRef = useRef(null);

  /** Initializes the countdown interval on mount */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /** Monitors time and triggers expiration callback */
  useEffect(() => {
    if (secondsLeft === 0) {
      if (onTimeUp) onTimeUp();
    }
  }, [secondsLeft, onTimeUp]);

  /**
   * Formats raw seconds into a readable HH:MM:SS string.
   *
   * @param {number} totalSeconds - The time remaining in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, "0"));
    parts.push(mins.toString().padStart(2, "0"));
    parts.push(secs.toString().padStart(2, "0"));

    return parts.join(":");
  };

  /**
   * Determines the UI color based on time urgency.
   *
   * @returns {string} Hex color code
   */
  const getTimerColor = () => {
    if (secondsLeft < 60) return "#E74C3C"; // Red for last minute
    if (secondsLeft < 300) return "#F39C12"; // Orange for last 5 mins
    return theme.colors.primary;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: getTimerColor(),
        },
      ]}
    >
      <Icon name="timer" type="material" size={20} color={getTimerColor()} />
      <Text style={[styles.timerText, { color: getTimerColor() }]}>
        {formatTime(secondsLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
    minWidth: 110,
    justifyContent: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
