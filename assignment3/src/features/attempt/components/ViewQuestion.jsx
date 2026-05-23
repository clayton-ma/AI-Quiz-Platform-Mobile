import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge, Icon } from "react-native-elements";

/**
 * ViewQuestion component displays a question with the user's answer and the correct answer.
 *
 * @param {Object} question - The question object
 * @param {number} index - Question index
 * @param {string} selectedOptionId - The ID of the option selected by the user
 */
export default function ViewQuestion({ question, index, selectedOptionId }) {
  // Prevent rendering if question data is missing
  if (!question) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Question {index + 1}</Text>
        {selectedOptionId && (
          <Badge
            value={
              question.options.find((o) => o._id === selectedOptionId)
                ?.is_correct
                ? "Correct"
                : "Incorrect"
            }
            status={
              question.options.find((o) => o._id === selectedOptionId)
                ?.is_correct
                ? "success"
                : "error"
            }
            badgeStyle={styles.badge}
          />
        )}
      </View>

      <Text style={styles.content}>{question.content}</Text>

      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = option._id === selectedOptionId;
          const isCorrect = option.is_correct;

          const optionStyle = [
            styles.optionItem,
            isCorrect && styles.optionCorrect,
            isSelected && !isCorrect && styles.optionIncorrect,
          ];

          return (
            <View key={option._id} style={optionStyle}>
              <Text
                style={[
                  styles.optionText,
                  (isSelected || isCorrect) && styles.optionTextBold,
                ]}
              >
                {option.content}
              </Text>
              <View style={styles.iconGroup}>
                {isSelected && (
                  <Badge
                    value="Your Answer"
                    status={isCorrect ? "success" : "error"}
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  badge: { paddingHorizontal: 8 },
  content: { fontSize: 16, color: "#34495E", marginBottom: 16 },
  optionsContainer: { gap: 8 },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ECF0F1",
  },
  optionCorrect: {
    borderColor: "#27AE60",
    backgroundColor: "#F1F9F4",
  },
  optionIncorrect: {
    borderColor: "#E74C3C",
    backgroundColor: "#FDEDEC",
  },
  optionText: { flex: 1, fontSize: 14, color: "#2C3E50" },
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
