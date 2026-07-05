import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import AttemptQuestion from "./AttemptQuestion";

/**
 * AttemptQuestionList component renders a list of questions for a quiz attempt.
 *
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Map of questionId to selectedOptionId
 * @param {Function} onAnswerChange - Callback when an answer is selected
 * @param {boolean} disabled - Whether the inputs should be disabled
 */
export default function AttemptQuestionList({
  questions,
  answers,
  onAnswerChange,
  disabled,
}) {
  // Return null if there are no questions to display
  if (!questions || questions.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Map through the questions array to render individual AttemptQuestion components */}
      {questions.map((question, index) => (
        <AttemptQuestion
          key={question._id}
          question={question}
          index={index}
          selectedOptionId={answers[question._id]}
          onSelect={(val) => onAnswerChange(question._id, val)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});
