import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Badge, Icon } from "react-native-elements";
import QuizControlButton from "./QuizControlButton";

export default function QuizItem({ quiz }) {
  const navigation = useNavigation();
  const item = quiz.item;
  const isPublished = item.status?.toLowerCase() === "published";

  return (
    <ListItem bottomDivider containerStyle={styles.listItem}>
      <ListItem.Content>
        <View style={styles.headerRow}>
          <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
          <Badge
            value={item.status}
            status={isPublished ? "success" : "warning"}
          />
        </View>
        <ListItem.Subtitle style={styles.subtitle}>
          Group: {item.groups?.length > 0 ? item.groups[0].name : "No Group"}
        </ListItem.Subtitle>

        <Text style={styles.lastUpdated}>
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
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  subtitle: { color: "#7F8C8D", marginTop: 4 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  resultText: { fontSize: 12, color: "#7F8C8D" },
  lastUpdated: { fontSize: 10, color: "#BDC3C7", marginTop: 4 },
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
