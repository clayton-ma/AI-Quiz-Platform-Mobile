import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../app/providers/ThemeContext";

export default function ListGroup({
  id,
  name,
  memberCount,
  isAdmin,
  onActionPress,
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.8)",
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        <Text
          style={[styles.count, { color: theme.dark ? "#909296" : "#666" }]}
        >
          {memberCount} members
        </Text>
      </View>
      {isAdmin ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={onActionPress}
        >
          <Text style={styles.buttonText}>Manage</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.disabledButton]}
          disabled={true}
        >
          <Text style={styles.buttonText}>View Only</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  count: { fontSize: 14 },
  button: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  disabledButton: { backgroundColor: "#adb5bd" },
  buttonText: { color: "#fff" },
});
