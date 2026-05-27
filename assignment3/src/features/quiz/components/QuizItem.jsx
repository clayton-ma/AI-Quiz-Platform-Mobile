import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Badge, Icon } from "react-native-elements";
import QuizControlButton from "./QuizControlButton";
import { useTheme } from "../../../app/providers/ThemeContext";

export default function QuizItem({ quiz }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const item = quiz.item;
  const isPublished = item.status?.toLowerCase() === "published";

  return (
    <View style={styles.outerContainer}>
      <ListItem
        containerStyle={[
          styles.listItem,
          {
            backgroundColor: theme.dark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(255, 255, 255, 0.8)",
            borderColor: theme.colors.border,
          },
        ]}
      >
        <ListItem.Content>
          <View style={styles.headerRow}>
            <ListItem.Title
              style={[styles.name, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </ListItem.Title>
          </View>
          <View style={styles.badgeRow}>
            <Badge
              value={
                item.status?.charAt(0).toUpperCase() + item.status?.slice(1)
              }
              status={isPublished ? "success" : "warning"}
              badgeStyle={styles.badgeStyle}
            />
          </View>

          <ListItem.Subtitle
            style={[
              styles.subtitle,
              { color: theme.dark ? "#909296" : "#7F8C8D" },
            ]}
          >
            Group: {item.groups?.length > 0 ? item.groups[0].name : "No Group"}
          </ListItem.Subtitle>

          <Text
            style={[
              styles.lastUpdated,
              { color: theme.dark ? "#5c5f66" : "#BDC3C7" },
            ]}
          >
            Last Updated: {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </ListItem.Content>
        <View style={styles.actions}>
          <QuizControlButton
            quizId={item.id || item._id}
            isPublished={isPublished}
            instantResult={item.instant_result}
          />
        </View>
      </ListItem>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listItem: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: { fontSize: 18, fontWeight: "bold", flex: 1 },
  badgeRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  badgeStyle: { borderRadius: 6, height: 22 },
  subtitle: { marginTop: 6 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  resultText: { fontSize: 12, color: "#7F8C8D" },
  lastUpdated: { fontSize: 10, marginTop: 4 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  attemptButton: {
    padding: 4,
  },
  publishAction: {
    alignItems: "center",
  },
  actionLabel: { fontSize: 10, color: "#27AE60", fontWeight: "bold" },
});
