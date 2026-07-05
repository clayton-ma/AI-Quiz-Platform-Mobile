import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../app/providers/ThemeContext";
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
  const { theme } = useTheme();

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

  /**
   * Sets a specific option as the correct answer and unsets all others.
   * @param {string} optId - The temporary ID of the option to mark correct
   */
  const setCorrect = (optId) => {
    setLocal((prev) => ({
      ...prev,
      options: prev.options.map((o) => ({
        ...o,
        is_correct: o.temId === optId,
      })),
    }));
  };

  /**
   * Adds a new blank option to the question. Limits total options to 4.
   */
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

  /**
   * Removes an option and ensures at least one remains marked correct if others exist.
   * @param {string} optId - The temporary ID of the option to remove
   */
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

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Question {index + 1}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            dispatch({ type: "DELETE_QUESTION", payload: q.temId })
          }
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#fff",
          },
        ]}
        value={local.content}
        onChangeText={updateContent}
        placeholder="Enter question text"
        placeholderTextColor={theme.dark ? "#666" : "#999"}
        multiline
      />

      <Text style={[styles.label, { color: theme.dark ? "#999" : "#666" }]}>
        Options
      </Text>

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
        <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
          + Add Option
        </Text>
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
