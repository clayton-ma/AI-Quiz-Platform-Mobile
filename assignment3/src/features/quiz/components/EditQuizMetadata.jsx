import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { fetchGroups } from "../../group/services/groupApi";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * EditQuizMetadata component handles the quiz settings.
 * Optimized with local state and debounced dispatch to prevent parent re-renders on every keystroke.
 */
export default function EditQuizMetadata({ metadata, dispatch }) {
  const [local, setLocal] = useState(metadata);
  const [groupsData, setGroupsData] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const { data: adminGroups } = await fetchGroups({ role: "admin" });
        if (adminGroups) {
          setGroupsData(adminGroups);
        }
      } catch (error) {}
    };
    loadGroups();
  }, []);

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

  const toggleGroup = (groupId) => {
    setLocal((prev) => {
      const currentIds = prev.groupIds || [];
      const isSelected = currentIds.includes(groupId);
      const newGroupIds = isSelected
        ? currentIds.filter((id) => id !== groupId)
        : [...currentIds, groupId];
      return { ...prev, groupIds: newGroupIds };
    });
  };

  // UI for quiz metadata editing, including title, description, group assignment, and instant result toggle
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
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons
            name="settings"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Quiz Configuration
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.dark ? "#1a365d" : "#e6f7ff" },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
            {local.status || "Draft"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>General Information</Text>

      <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
        Quiz Title
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#fff",
          },
        ]}
        placeholder="Enter quiz title"
        placeholderTextColor={theme.dark ? "#666" : "#999"}
        value={local.name || ""}
        onChangeText={(val) => handleChange("name", val)}
      />

      <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
        Description
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            color: theme.colors.text,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#fff",
          },
        ]}
        placeholder="Enter quiz description"
        placeholderTextColor={theme.dark ? "#666" : "#999"}
        value={local.description || ""}
        onChangeText={(val) => handleChange("description", val)}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.sectionLabel}>Access & Results</Text>

      <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
        Assign to Groups
      </Text>
      <View style={styles.groupsList}>
        {groupsData.map((g) => {
          const groupId = g.id || g._id;
          const isSelected = local.groupIds?.includes(groupId);
          return (
            <TouchableOpacity
              key={groupId}
              style={[
                styles.groupChip,
                { borderColor: theme.colors.primary },
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => toggleGroup(groupId)}
            >
              <Text
                style={[
                  styles.groupChipText,
                  isSelected && styles.groupChipTextSelected,
                ]}
              >
                {g.name}
              </Text>
              {isSelected && (
                <MaterialIcons name="check" size={14} color="#fff" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchTextContainer}>
          <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
            Show instant results
          </Text>
          <Text
            style={[
              styles.switchDescription,
              { color: theme.dark ? "#999" : "#666" },
            ]}
          >
            Students see scores immediately after submission
          </Text>
        </View>
        <Switch
          value={!!local.instant_result}
          onValueChange={(val) => handleChange("instant_result", val)}
          trackColor={{ false: "#ddd", true: theme.colors.primary }}
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
  groupsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  groupChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
    gap: 4,
  },
  groupChipSelected: {
    backgroundColor: "#007bff",
  },
  groupChipText: {
    color: "#007bff",
    fontSize: 12,
    fontWeight: "500",
  },
  groupChipTextSelected: {
    color: "#fff",
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
