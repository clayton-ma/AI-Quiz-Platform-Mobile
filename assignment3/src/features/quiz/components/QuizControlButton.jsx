import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { toggleInstantResult } from "../services/quizApi";

export default function QuizControlButton({
  quizId,
  isPublished,
  instantResult,
}) {
  const navigation = useNavigation();
  const [localInstantResult, setLocalInstantResult] = useState(instantResult);

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
