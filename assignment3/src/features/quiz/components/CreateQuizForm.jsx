import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { createQuiz } from "../services/quizApi";
import { fetchGroups } from "../../group/services/groupApi";

export default function CreateQuizForm() {
  const [loading, setLoading] = useState(false); // Controls loading state for API calls
  const [groupsData, setGroupsData] = useState([]);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instant_result: true,
    groupIds: [],
  });

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const { data: adminGroups } = await fetchGroups({ role: "admin" });
        if (adminGroups) {
          setGroupsData(adminGroups);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  const handleSubmit = async () => {
    if (formData.name.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }
    if (formData.groupIds.length === 0) {
      alert("Please select a group");
      return;
    }

    setLoading(true);
    try {
      const response = await createQuiz(formData);
      const quizId = response._id || response.id;
      navigation.navigate("EditQuiz", { quizId });
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId) => {
    setFormData((prev) => {
      const isSelected = prev.groupIds.includes(groupId);
      const newGroupIds = isSelected
        ? prev.groupIds.filter((id) => id !== groupId)
        : [...prev.groupIds, groupId];
      return { ...prev, groupIds: newGroupIds };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Quiz Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quiz title"
          value={formData.name}
          onChangeText={(val) => setFormData({ ...formData, name: val })}
          disabled={loading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description of the quiz"
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(val) => setFormData({ ...formData, description: val })}
          disabled={loading}
        />

        <Text style={styles.label}>Assign to Groups</Text>
        <View style={styles.groupsList}>
          {groupsData.map((g) => {
            const isSelected = formData.groupIds.includes(g._id || g.id);
            return (
              <TouchableOpacity
                key={g._id || g.id}
                style={[
                  styles.groupChip,
                  isSelected && styles.groupChipSelected,
                ]}
                onPress={() => toggleGroup(g._id)}
                disabled={loading}
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
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.switchContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Show instant results</Text>
            <Text style={styles.switchDesc}>
              Students see scores immediately
            </Text>
          </View>
          <Switch
            value={formData.instant_result}
            onValueChange={(val) =>
              setFormData({ ...formData, instant_result: val })
            }
            disabled={loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Create Quiz</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  groupChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: "500",
  },
  groupChipTextSelected: {
    color: "#fff",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#2C3E50" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  switchLabel: { fontSize: 16, fontWeight: "600" },
  switchDesc: { fontSize: 12, color: "#7F8C8D" },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledButton: { opacity: 0.7 },
});
