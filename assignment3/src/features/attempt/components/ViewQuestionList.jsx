/**
 * @file ViewQuestionList.jsx
 * @description Component for rendering a collection of questions in review mode.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import ViewQuestion from "./ViewQuestion";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * ViewQuestionList component.
 *
 * Renders a vertical list of questions, mapping user answers to their respective questions
 * to display correctness and feedback.
 *
 * @param {Object} props - Component props
 * @param {Array} props.questions - Array of question objects from the quiz
 * @param {Array|Object} props.selectedAnswers - User's submitted answers
 */
export default function ViewQuestionList({ questions, selectedAnswers }) {
  const { theme } = useTheme();
  if (!questions || questions.length === 0) return null;

  // Convert answers array to map if it's not already
  const answersMap = Array.isArray(selectedAnswers)
    ? selectedAnswers.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.question_id]: curr.selected_option_id,
        }),
        {},
      )
    : selectedAnswers || {};

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Iterate through questions to render individual review cards */}
      {questions.map((question, index) => (
        <ViewQuestion
          key={question._id}
          question={question}
          index={index}
          selectedOptionId={answersMap[question._id]}
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
