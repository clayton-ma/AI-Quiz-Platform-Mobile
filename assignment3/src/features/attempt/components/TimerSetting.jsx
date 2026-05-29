import React from "react";
import { View, StyleSheet } from "react-native";
import AttemptTimer from "./AttemptTimer";

/**
 * TimerSetting component provides a standalone interface for the AttemptTimer.
 * 
 * @param {number} questionCount - Number of questions to calculate time
 * @param {Function} onTimeUp - Callback function when timer reaches zero
 * @param {number} customTimeLimit - Optional custom time in seconds
 * @param {number} minutesPerQuestion - Minutes allowed per question
 */
export default function TimerSetting({ questionCount, onTimeUp, customTimeLimit, minutesPerQuestion }) {
    return (
        <View style={styles.container}>
            <AttemptTimer
                questionCount={questionCount}
                onTimeUp={onTimeUp}
                customTimeLimit={customTimeLimit}
                minutesPerQuestion={minutesPerQuestion}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
