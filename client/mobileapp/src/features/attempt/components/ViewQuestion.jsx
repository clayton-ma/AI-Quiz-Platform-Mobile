/**
 * @file ViewQuestion.jsx
 * @description Component for displaying a single question's result, highlighting user choice and correct answer.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge, Icon } from "@rneui/themed";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * ViewQuestion component displays a question with the user's answer and the correct answer.
 *
 * @param {Object} question - The question object
 * @param {number} index - Question index
 * @param {string} selectedOptionId - The ID of the option selected by the user
 */
export default function ViewQuestion({ question, index, selectedOptionId }) {
  const { theme } = useTheme();
  // Prevent rendering if question data or options are missing
  if (!question || !question.options) return null;

  const selectedOption = question.options.find(
    (o) => o._id === selectedOptionId,
  );
  const hasCorrectAnswerInfo = question.options.some(
    (o) => o.is_correct !== undefined,
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Question {index + 1}
        </Text>
        {selectedOptionId && hasCorrectAnswerInfo && (
          <Badge
            value={selectedOption?.is_correct ? "Correct" : "Incorrect"}
            // Use standard status colors for correctness feedback
            status={selectedOption?.is_correct ? "success" : "error"}
            badgeStyle={styles.badge}
          />
        )}
      </View>

      <Text
        style={[styles.content, { color: theme.dark ? "#ccc" : "#34495E" }]}
      >
        {question.content}
      </Text>

      {/* Options list with conditional styling based on correctness and user selection */}
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = option._id === selectedOptionId;
          const isCorrect = hasCorrectAnswerInfo && option.is_correct;

          const optionStyle = [
            styles.optionItem,
            hasCorrectAnswerInfo && isCorrect && styles.optionCorrect,
            isSelected && !isCorrect && styles.optionIncorrect,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.dark
                ? "rgba(255,255,255,0.05)"
                : "#FDFEFE",
            },
            hasCorrectAnswerInfo &&
              isCorrect && {
                backgroundColor: theme.dark
                  ? "rgba(39, 174, 96, 0.1)"
                  : "#F1F9F4",
              },
          ];

          return (
            <View key={option._id} style={optionStyle}>
              <Text
                style={[
                  styles.optionText,
                  { color: theme.colors.text },
                  (isSelected || isCorrect) && [
                    styles.optionTextBold,
                    isCorrect && { color: "#27AE60" },
                  ],
                ]}
              >
                {option.content}
              </Text>
              <View style={styles.iconGroup}>
                {isSelected && (
                  <Badge
                    value="Your Answer"
                    status={
                      hasCorrectAnswerInfo
                        ? isCorrect
                          ? "success"
                          : "error"
                        : "primary"
                    }
                    badgeStyle={styles.smallBadge}
                    textStyle={styles.smallBadgeText}
                  />
                )}
                {isCorrect && (
                  <Icon name="check-circle" color="#27AE60" size={20} />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  badge: { paddingHorizontal: 8 },
  content: { fontSize: 16, marginBottom: 16 },
  optionsContainer: { gap: 8 },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionCorrect: {
    borderColor: "#27AE60",
    backgroundColor: "#F1F9F4",
  },
  optionIncorrect: {
    borderColor: "#E74C3C",
    backgroundColor: "#FDEDEC",
  },
  optionText: { flex: 1, fontSize: 14 },
  optionTextBold: { fontWeight: "600" },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallBadge: {
    height: 18,
    paddingHorizontal: 4,
  },
  smallBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
});
