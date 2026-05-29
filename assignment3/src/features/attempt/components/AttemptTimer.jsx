import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * AttemptTimer component that handles countdown logic.
 * 
 * @param {number} questionCount - Number of questions to calculate time (1 min per question)
 * @param {Function} onTimeUp - Callback function when timer reaches zero
 * @param {number} customTimeLimit - Optional custom time in seconds
 */
export default function AttemptTimer({ questionCount = 0, onTimeUp, customTimeLimit }) {
    const { theme } = useTheme();

    // Calculate initial time: custom limit OR 1 minute per question
    const initialTime = customTimeLimit || (questionCount > 0 ? questionCount * 60 : 600);
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onTimeUp) onTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const isLowTime = timeLeft < 60;

    return (
        <View
            style={[
                styles.timerContainer,
                {
                    backgroundColor: theme.colors.card,
                    borderColor: isLowTime ? "#E74C3C" : theme.colors.border,
                },
            ]}
        >
            <Icon
                name="timer"
                type="material"
                size={20}
                color={isLowTime ? "#E74C3C" : theme.colors.primary}
            />
            <Text
                style={[
                    styles.timerText,
                    { color: isLowTime ? "#E74C3C" : theme.colors.text },
                ]}
            >
                Time Remaining: {formatTime(timeLeft)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
        gap: 8,
        justifyContent: "center",
    },
    timerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
