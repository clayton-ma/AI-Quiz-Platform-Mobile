import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { toggleInstantResult } from "../services/quizApi";

/**
 * QuizControlButton component provides contextual actions for a quiz item.
 * For published quizzes, it allows viewing attempts and toggling result visibility.
 * For draft quizzes, it provides an edit action.
 *
 * @param {Object} props - Component props
 * @param {string} props.quizId - The unique identifier of the quiz
 * @param {boolean} props.isPublished - Whether the quiz is currently published
 * @param {boolean} props.instantResult - Initial state of the instant result setting
 */
export default function QuizControlButton({
  quizId,
  isPublished,
  instantResult,
}) {
  const navigation = useNavigation();
  // Local state to manage the toggle UI without waiting for a full list refresh
  const [localInstantResult, setLocalInstantResult] = useState(instantResult);

  /**
   * Toggles the instant result setting via the API and updates local state.
   */
  const handleToggleInstantResult = async () => {
    const newValue = !localInstantResult;
    try {
      await toggleInstantResult({ quizId, instant_result: newValue });
      setLocalInstantResult(newValue);
    } catch (error) {}
  };

  return (
    <View style={styles.actions}>
      {isPublished ? (
        /* Actions for Published Quizzes */
        <View>
          <TouchableOpacity
            style={styles.attemptButton}
            onPress={() =>
              navigation.navigate("Attempt", {
                screen: "ListAttempt",
                params: { quizId: quizId },
              })
            }
          >
            <View style={styles.publishAction}>
              <Icon name="play-arrow" color="#27AE60" size={24} />
              <Text style={styles.actionLabel}>Attempt</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.attemptButton}
            onPress={handleToggleInstantResult}
          >
            <View style={styles.publishAction}>
              <Icon
                name={localInstantResult ? "visibility" : "visibility-off"}
                color="#2980B9"
                size={24}
              />
              <Text style={[styles.actionLabel, { color: "#2980B9" }]}>
                {localInstantResult ? "Results On" : "Results Off"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        /* Actions for Draft Quizzes */
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditQuiz", {
              quizId: quizId,
            })
          }
        >
          <Icon name="edit" color="#2C3E50" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  attemptButton: {
    padding: 4,
  },
  publishAction: {
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 10,
    color: "#27AE60",
    fontWeight: "bold",
  },
});
