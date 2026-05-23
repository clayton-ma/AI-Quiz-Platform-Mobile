import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Badge } from "react-native-elements";

/**
 * QuizDetails component displays the static metadata of a quiz.
 * This is typically used as a header in the attempt listing or preview pages.
 *
 * @param {Object} props.quiz - The quiz object containing name and description.
 */
export default function QuizDetails({ quiz }) {
  // Prevent rendering if quiz data hasn't loaded yet
  if (!quiz) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{quiz.name || "Untitled Quiz"}</Text>
        </View>
        <Badge
          value={quiz.instant_result ? "Results Released" : "Results Hidden"}
          status={quiz.instant_result ? "success" : "warning"}
          badgeStyle={styles.badge}
          textStyle={styles.badgeText}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.descriptionRow}>
        <Icon
          name="info-outline"
          type="material"
          size={18}
          color="#7F8C8D"
          containerStyle={styles.infoIcon}
        />
        <Text style={styles.description}>
          {quiz.description || "No description provided for this quiz."}
        </Text>
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
    color: "#2980B9",
  },
  badge: {
    paddingHorizontal: 8,
    height: 24,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginVertical: 12,
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: "#2C3E50",
    lineHeight: 20,
  },
});
