import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * AttemptQuestion component renders a single question and its options for a quiz attempt.
 *
 * @param {Object} question - The question data including content and options
 * @param {number} index - The index of the question in the list
 * @param {string} selectedOptionId - The ID of the currently selected option
 * @param {Function} onSelect - Callback when an option is selected
 * @param {boolean} disabled - Whether the inputs should be disabled (e.g., during submission)
 */
export default function AttemptQuestion({
  question,
  index,
  selectedOptionId,
  onSelect,
  disabled,
}) {
  const { theme } = useTheme();
  if (!question) return null;

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
      {/* Question Header */}
      <Text style={[styles.headerText, { color: theme.colors.text }]}>Question {index + 1}</Text>

      {/* Question Content */}
      <Text style={[styles.content, { color: theme.dark ? "#ccc" : "#34495E" }]}>{question.content}</Text>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = selectedOptionId === option._id;
          return (
            <TouchableOpacity
              key={option._id}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                isSelected && {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.dark ? "rgba(41, 128, 185, 0.1)" : "#EBF5FB",
                },
                disabled && styles.disabledOption,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#FDFEFE",
                },
              ]}
              onPress={() => onSelect(option._id)}
              disabled={disabled}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: theme.dark ? "#555" : "#BDC3C7" },
                  isSelected && { borderColor: theme.colors.primary },
                ]}
              >
                {isSelected && (
                  <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  { color: theme.colors.text },
                  isSelected && [styles.optionTextSelected, { color: theme.colors.primary }],
                ]}
              >
                {option.content}
              </Text>
            </TouchableOpacity>
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
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ECF0F1",
    backgroundColor: "#FDFEFE",
  },
  optionSelected: {
    borderColor: "#2980B9",
    backgroundColor: "#EBF5FB",
  },
  disabledOption: {
    opacity: 0.6,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#BDC3C7",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#2980B9",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#2980B9",
  },
  optionText: {
    fontSize: 15,
    color: "#2C3E50",
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});
