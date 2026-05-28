import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon, Badge } from "react-native-elements";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * AttemptDetails component displays the header information for a quiz attempt
 * and provides actions to save or submit.
 *
 * @param {Object} quiz - The quiz metadata
 * @param {Object} attempt - The current attempt data
 * @param {Function} onSave - Handler for saving progress
 * @param {Function} onSubmit - Handler for final submission
 * @param {boolean} loading - Loading state for buttons
 */
export default function AttemptDetails({
  quiz,
  attempt,
  onSave,
  onSubmit,
  loading,
}) {
  const { theme } = useTheme();

  // Return null if essential data is missing to prevent rendering errors
  if (!quiz || !attempt) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{quiz.name || "Quiz Attempt"}</Text>
          <Text style={[styles.subtitle, { color: theme.dark ? "#999" : "#7F8C8D" }]}>
            Started: {new Date(attempt.createdAt).toLocaleString()}
          </Text>
        </View>
        <Badge
          value="In Progress"
          status="primary"
          badgeStyle={styles.badge}
          textStyle={styles.badgeText}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            {
              backgroundColor: theme.dark ? "rgba(41, 128, 185, 0.1)" : "#EBF5FB",
              borderColor: theme.colors.primary,
            },
          ]}
          onPress={onSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <Icon name="save" size={18} color={theme.colors.primary} />
              <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>Save</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="send" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Submit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  subtitle: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  badge: { paddingHorizontal: 8, height: 24 },
  badgeText: { fontSize: 10, fontWeight: "bold" },
  divider: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginVertical: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  saveButton: {
    backgroundColor: "#EBF5FB",
    borderWidth: 1,
    borderColor: "#2980B9",
  },
  submitButton: {
    backgroundColor: "#27AE60",
  },
  saveButtonText: {
    color: "#2980B9",
    fontWeight: "bold",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
