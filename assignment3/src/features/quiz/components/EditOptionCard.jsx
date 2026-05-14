import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * EditOptionCard component handles the individual option within a question.
 * It uses local state and debouncing to sync text changes back to the parent question state.
 *
 * @param {Object} opt - The option object containing temId and content
 * @param {Function} onChange - Callback to sync text changes
 * @param {Function} onDelete - Callback to remove this option
 * @param {Function} onCorrect - Callback to set this option as the correct answer
 */
export default function EditOptionCard({ opt, onChange, onDelete, onCorrect }) {
  // Local state for the option's text to prevent excessive updates to the parent reducer on every keystroke
  const [text, setText] = useState(opt.content);

  // Sync local text state with prop changes (e.g., when loading existing question data)
  useEffect(() => {
    setText(opt.content);
  }, [opt.content]);

  // Debounce the onChange call to prevent excessive state updates in the parent reducer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== opt.content) {
        onChange(text);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [text, opt.content]);

  // UI for editing an option, marking it as correct, and deleting it
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.radio, opt.is_correct && styles.radioSelected]}
        onPress={onCorrect}
      >
        {opt.is_correct && <View style={styles.radioInner} />}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Option text"
      />

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color="#ff4d4f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#007bff",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
});
