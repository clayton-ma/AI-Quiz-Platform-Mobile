import React from "react";
import { View, StyleSheet } from "react-native";
import ViewQuestion from "./ViewQuestion";

/**
 * ViewQuestionList component renders a list of questions with their results.
 *
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Map of questionId to selectedOptionId
 */
export default function ViewQuestionList({ questions, selectedAnswers }) {
  if (!questions || questions.length === 0) return null;
  console.log("Rendering ViewQuestionList with questions:", questions);

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
    <View style={styles.container}>
      {/* Map through questions to display the result for each */}
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
