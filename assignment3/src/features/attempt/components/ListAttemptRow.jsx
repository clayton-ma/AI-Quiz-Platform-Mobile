import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon, Badge, ListItem } from "react-native-elements";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * ListAttemptRow component renders a single row within the ListAttemptTable.
 * It displays attempt metadata and provides navigation actions.
 *
 * @param {Object} attempt - The attempt data object
 */
export default function ListAttemptRow(attempt) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Configuration for status badges to ensure visual consistency across the UI
  const statusConfig = {
    submitted: { status: "success", icon: "check-circle" },
    saved: { status: "primary", icon: "history" },
    completed: { status: "success", icon: "check-circle" },
    in_progress: { status: "primary", icon: "history" },
  };

  const config = statusConfig[attempt.status?.toLowerCase()] || {
    status: "primary",
    icon: null,
  };

  const scoreText =
    attempt.status !== "submitted"
      ? "Not Submitted"
      :
      attempt.score === undefined
        ? "Not Released"
        : `${attempt.score}`;

  return (
    <ListItem
      bottomDivider
      containerStyle={[
        styles.container,
        { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border },
      ]}
    >
      <ListItem.Content>
        <View style={styles.header}>
          <Badge
            value={attempt.status?.replace("_", " ").toUpperCase() || "UNKNOWN"}
            status={config.status}
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
          />
          <Text style={[styles.date, { color: theme.dark ? "#999" : "#7F8C8D" }]}>
            {new Date(attempt.updatedAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Score: </Text>
          <Text style={[styles.scoreValue, { color: theme.colors.text }]}>
            {scoreText}
          </Text>
        </View>
      </ListItem.Content>

      <View style={styles.actions}>
        {attempt.status === "saved" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TakeAttempt", {
                quizId: attempt.quiz_id,
                attemptId: attempt._id,
              })
            }
          >
            <Icon name="play-arrow" color="#27AE60" size={28} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewAttempt", { attemptId: attempt._id })
            }
          >
            <Icon name="visibility" color="#2980B9" size={28} />
          </TouchableOpacity>
        )}
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
  },
  date: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#2C3E50",
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  actions: {
    paddingLeft: 10,
  },
});
