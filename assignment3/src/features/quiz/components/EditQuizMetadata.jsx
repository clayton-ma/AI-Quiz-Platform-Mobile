import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * EditQuizMetadata component handles the quiz settings.
 * Optimized with local state and debounced dispatch to prevent parent re-renders on every keystroke.
 */
export default function EditQuizMetadata({ metadata, dispatch }) {
  const [local, setLocal] = useState(metadata);
  const groupsData = [
    { id: "1", name: "Computer Science 101" },
    { id: "2", name: "Advanced Mathematics" },
    { id: "3", name: "History of Art" },
  ];
  // Keep local state in sync when parent metadata changes (e.g. after a save or initial load)
  useEffect(() => {
    setLocal(metadata);
  }, [
    metadata.name,
    metadata.description,
    metadata.groupIds,
    metadata.status,
    metadata.instant_result,
  ]);

  // Debounce effect: Sync local changes to the parent reducer after 300ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only dispatch if local state actually differs from metadata to avoid loops
      if (JSON.stringify(local) !== JSON.stringify(metadata)) {
        dispatch({ type: "SET_METADATA", payload: local });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [local, dispatch, metadata]);

  const handleChange = useCallback((field, value) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  }, []);

  // UI for quiz metadata editing, including title, description, group assignment, and instant result toggle
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="settings" size={20} color="#007bff" />
          <Text style={styles.headerTitle}>Quiz Configuration</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{local.status || "Draft"}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>General Information</Text>

      <Text style={styles.inputLabel}>Quiz Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quiz title"
        value={local.name || ""}
        onChangeText={(val) => handleChange("name", val)}
      />

      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter quiz description"
        value={local.description || ""}
        onChangeText={(val) => handleChange("description", val)}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.sectionLabel}>Access & Results</Text>

      <Text style={styles.inputLabel}>Assign to Group</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={
            local.groupIds && local.groupIds.length > 0 ? local.groupIds[0] : ""
          }
          onValueChange={(itemValue) => handleChange("groupIds", [itemValue])}
          style={styles.picker}
        >
          <Picker.Item label="Select a group..." value={null} />
          {groupsData?.map((group) => (
            <Picker.Item
              key={group.id || group._id}
              label={group.name}
              value={group.id || group._id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchLabel}>Show instant results</Text>
          <Text style={styles.switchDescription}>
            Students see scores immediately after submission
          </Text>
        </View>
        <Switch
          value={!!local.instant_result}
          onValueChange={(val) => handleChange("instant_result", val)}
          trackColor={{ false: "#ddd", true: "#007bff" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  badge: {
    backgroundColor: "#e6f7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: "#1890ff", fontSize: 12, textTransform: "capitalize" },
  sectionLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextContainer: { flex: 1, marginRight: 8 },
  switchLabel: { fontSize: 14, fontWeight: "600" },
  switchDescription: { fontSize: 12, color: "#666" },
});
