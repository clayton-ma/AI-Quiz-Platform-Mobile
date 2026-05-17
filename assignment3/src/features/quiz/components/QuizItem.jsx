import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Badge, Icon } from "react-native-elements";

export default function QuizItem({ item }) {
  const navigation = useNavigation();

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={styles.headerRow}>
          <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
          <Badge
            value={item.status}
            status={item.status === "Published" ? "success" : "warning"}
          />
        </View>
        <ListItem.Subtitle style={styles.subtitle}>
          Group: {item.group}
        </ListItem.Subtitle>
        <View style={styles.resultRow}>
          <Icon
            name={item.instant_result ? "visibility" : "visibility-off"}
            size={14}
            color="#7F8C8D"
          />
          <Text style={styles.resultText}>
            Instant Results: {item.instant_result ? "On" : "Off"}
          </Text>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {item.lastUpdated}</Text>
      </ListItem.Content>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditQuiz", { quizId: item.id })}
        >
          <Icon name="edit" color="#2C3E50" size={24} />
        </TouchableOpacity>
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
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
});
