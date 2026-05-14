import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import EditOptionCard from "./EditOptionCard";

/**
 * EditQuestionCard component handles the editing of a single quiz question.
 * It manages local state for question content and options, then syncs changes
 * back to the parent reducer using a debounced effect to optimize performance.
 *
 * @param {Object} q - The question object
 * @param {number} index - The display index of the question
 * @param {Function} dispatch - Reducer dispatch function from EditQuizPage
 */
export default function EditQuestionCard({ q, index, dispatch }) {
  // Local state to manage question data before syncing to parent
  const [local, setLocal] = useState(q);

  // Keep local state in sync with props (important for initial load and AI generation)
  useEffect(() => {
    setLocal(q);
  }, [q]);

  // Debounce the dispatch to the parent reducer to prevent performance lag on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SYNC_QUESTION", payload: local });
    }, 300);

    return () => clearTimeout(timer);
  }, [local]);

  // Update the question text
  const updateContent = (value) => {
    setLocal((prev) => ({ ...prev, content: value }));
  };

  // Update a specific option's text
  const updateOption = (optId, value) => {
    setLocal((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.temId === optId ? { ...o, content: value } : o,
      ),
    }));
  };

  // Set an option as the correct answer and unset others
  const setCorrect = (optId) => {
    setLocal((prev) => ({
      ...prev,
      options: prev.options.map((o) => ({
        ...o,
        is_correct: o.temId === optId,
      })),
    }));
  };

  // Add a new option (limit to 4 for standard MCQ)
  const addOption = () => {
    if (local.options.length >= 4) return;

    setLocal((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          temId: Math.random().toString(36).substr(2, 9),
          content: "",
          is_correct: false,
        },
      ],
    }));
  };

  // Remove an option and ensure at least one is marked correct if any remain
  const deleteOption = (optId) => {
    setLocal((prev) => {
      const updated = prev.options.filter((o) => o.temId !== optId);

      // If we deleted the correct answer, default the first remaining option to correct
      if (!updated.some((o) => o.is_correct) && updated.length) {
        updated[0].is_correct = true;
      }

      return { ...prev, options: updated };
    });
  };

  // UI for editing a question, its options, and managing correct answers and deletions
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Question {index + 1}</Text>

        {/* Delete Question Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            dispatch({ type: "DELETE_QUESTION", payload: q.temId })
          }
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Question Content Input */}
      <TextInput
        style={styles.input}
        value={local.content}
        onChangeText={updateContent}
        placeholder="Enter question text"
        multiline
      />

      <Text style={styles.label}>Options</Text>

      {/* Option Cards */}
      <View style={styles.optionsList}>
        {local.options.map((opt) => (
          <EditOptionCard
            key={opt.temId}
            opt={opt}
            onChange={(val) => updateOption(opt.temId, val)}
            onDelete={() => deleteOption(opt.temId)}
            onCorrect={() => setCorrect(opt.temId)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.addButton,
          local.options.length >= 4 && styles.disabledButton,
        ]}
        disabled={local.options.length >= 4}
        onPress={addOption}
      >
        <Text style={styles.addButtonText}>+ Add Option</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: "#ff4d4f",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  optionsList: {
    gap: 8,
  },
  addButton: {
    marginTop: 12,
    padding: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#007bff", fontWeight: "500" },
  disabledButton: { opacity: 0.5 },
});
