/**
 * @file EditOptionCard.jsx
 * @description Component for editing individual quiz question options with debounced state synchronization.
 */
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * EditOptionCard component handles the individual option within a question.
 * It uses local state and debouncing to sync text changes back to the parent question state
 * to optimize performance during text input.
 *
 * @param {Object} props.opt - The option object containing temId, content, and is_correct status
 * @param {Function} props.onChange - Callback to sync text changes to the parent
 * @param {Function} props.onDelete - Callback to remove this option
 * @param {Function} onCorrect - Callback to set this option as the correct answer
 */
export default function EditOptionCard({ opt, onChange, onDelete, onCorrect }) {
  // Local state for the option's text to prevent excessive updates to the parent reducer on every keystroke
  const [text, setText] = useState(opt.content);
  const { theme } = useTheme();

  /**
   * Sync local text state with prop changes.
   * Important for initial load and when AI generates new content.
   */
  useEffect(() => {
    setText(opt.content);
  }, [opt.content]);

  /**
   * Debounce the onChange call to prevent excessive state updates in the parent reducer. */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== opt.content) {
        onChange(text);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [text, opt.content]);

  return (
    <View style={styles.container}>
      {/* Radio button to mark option as correct */}
      <TouchableOpacity
        style={[
          styles.radio,
          {
            borderColor: theme.colors.primary,
            backgroundColor: theme.dark ? "transparent" : "#fff",
          },
          opt.is_correct && styles.radioSelected,
        ]}
        onPress={onCorrect}
      >
        {opt.is_correct && (
          <View
            style={[
              styles.radioInner,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: theme.colors.border,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "#fff",
          },
        ]}
        value={text}
        onChangeText={setText}
        placeholder="Option text"
        placeholderTextColor={theme.dark ? "#666" : "#999"}
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
