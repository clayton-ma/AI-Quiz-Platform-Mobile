import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { generateQuestions } from "../services/quizApi";
import ShowNotification from "../../../components/ui/ShowNotification";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * GenerateQuestionModal component.
 *
 * Provides a modal interface for instructors to generate quiz questions using AI.
 * Users can specify a topic and the desired number of questions.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.opened - Controls modal visibility
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.dispatch - Reducer dispatch function to update quiz state
 * @returns {JSX.Element} The rendered AI generation modal.
 */
export default function GenerateQuestionModal({ opened, onClose, dispatch }) {
  const [numQuestions, setNumQuestions] = useState(1);
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  /** Handles the AI generation request and updates the parent state */
  const handleGenerate = useCallback(async () => {
    try {
      setLoading(true);

      const res = await generateQuestions(topics, numQuestions);

      if (!res || !res.questions) {
        throw new Error("Failed to generate questions. Please try again.");
      }

      dispatch({
        type: "ADD_QUESTIONS",
        payload: res.questions,
      });

      ShowNotification({
        title: "Success",
        message: "Questions generated successfully",
        type: "success",
      });
      onClose();
    } catch (err) {
      ShowErrorNotification(err);
    } finally {
      setLoading(false);
    }
  }, [topics, numQuestions, dispatch, onClose]);

  return (
    <Modal
      visible={opened}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Generate AI Quiz
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.dark ? "#999" : "#666" },
                ]}
              >
                AI is generating your questions...
              </Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Topic
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.dark
                      ? "rgba(255,255,255,0.05)"
                      : "#fff",
                  },
                ]}
                placeholder="e.g. Quantum Physics basics or React Hooks"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                multiline
                numberOfLines={4}
                maxLength={500}
                value={topics}
                onChangeText={setTopics}
              />

              <Text style={[styles.label, { color: theme.colors.text }]}>
                Number of Questions (Max 10)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.dark
                      ? "rgba(255,255,255,0.05)"
                      : "#fff",
                  },
                ]}
                keyboardType="numeric"
                placeholder="1-10"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                value={numQuestions?.toString() || ""}
                onChangeText={(val) => setNumQuestions(parseInt(val) || 0)}
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: theme.dark ? "#999" : "#666" },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => topics.trim() && onGenerate()}
                >
                  <Text style={[styles.generateButtonText, { color: "#fff" }]}>
                    Generate Questions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  cancelButton: { padding: 10 },
  cancelButtonText: { color: "#666" },
  generateButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  generateButtonText: { color: "#fff", fontWeight: "600" },
  loadingContainer: { padding: 40, alignItems: "center" },
  loadingText: { marginTop: 15, color: "#666" },
});
