import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ListGroup({
  id,
  name,
  memberCount,
  isAdmin,
  onActionPress,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.count}>{memberCount} members</Text>
      </View>
      {isAdmin && (
        <TouchableOpacity style={styles.button} onPress={onActionPress}>
          <Text style={styles.buttonText}>Manage</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { fontSize: 18, fontWeight: "bold" },
  count: { color: "#666" },
  button: { backgroundColor: "#000", padding: 8, borderRadius: 4 },
  buttonText: { color: "#fff" },
});
