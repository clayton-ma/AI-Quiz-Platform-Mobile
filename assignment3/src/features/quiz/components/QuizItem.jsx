import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import QuizControlButton from "./QuizControlButton";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * QuizItem component renders a card representing a single quiz.
 * It displays the quiz title, status (Draft/Published), assigned group, and last update date.
 *
 * @param {Object} props - Component props
 * @param {Object} props.quiz - The quiz data object
 */
export default function QuizItem({ quiz }) {
  const { theme } = useTheme();

  const isPublished = quiz.status?.toLowerCase() === "published";
  const quizId = quiz.id || quiz._id;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
            borderColor: theme.colors.border,
            borderLeftColor: isPublished ? "#27AE60" : "#F39C12",
          },
        ]}
      >
        <View style={styles.content}>
          {/* Quiz Name */}
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: theme.colors.text,
              },
            ]}
          >
            {quiz.name || "Untitled Quiz"}
          </Text>

          {/* Status */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isPublished ? "#27AE60" : "#F39C12",
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: isPublished ? "#27AE60" : "#F39C12",
                },
              ]}
            >
              {isPublished ? "Published" : "Draft"}
            </Text>
          </View>

          {/* Group */}
          <View style={styles.infoRow}>
            <Icon
              name="groups"
              type="material"
              size={16}
              color={theme.dark ? "#A0A0A0" : "#7F8C8D"}
            />
            <Text
              style={[
                styles.infoText,
                {
                  color: theme.dark ? "#B0B3B8" : "#7F8C8D",
                },
              ]}
            >
              {quiz.groups?.[0]?.name || "No Group"}
            </Text>
          </View>

          {/* Updated Date */}
          <View style={styles.infoRow}>
            <Icon
              name="schedule"
              type="material"
              size={16}
              color={theme.dark ? "#8A8D91" : "#95A5A6"}
            />
            <Text
              style={[
                styles.dateText,
                {
                  color: theme.dark ? "#8A8D91" : "#95A5A6",
                },
              ]}
            >
              Updated{" "}
              {quiz.updatedAt
                ? new Date(quiz.updatedAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <QuizControlButton
            quizId={quizId}
            isPublished={isPublished}
            instantResult={quiz.instant_result}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  card: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 5,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },

  dateText: {
    marginLeft: 8,
    fontSize: 12,
  },

  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
