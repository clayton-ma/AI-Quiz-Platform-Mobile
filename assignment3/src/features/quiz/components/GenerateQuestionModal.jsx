import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

/**
 * GenerateQuestionModal provides an interface for users to input topics
 * and specify the number of questions they want the AI to generate for a quiz.
 */
export default function GenerateQuestionModal({
  opened,
  onClose,
  topics,
  setTopics,
  numQuestions,
  setNumQuestions,
  onGenerate,
  loading,
}) {
  return (
    <Modal
      visible={opened}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Generate AI Quiz</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>
                AI is generating your questions...
              </Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Topic</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Quantum Physics basics or React Hooks"
                multiline
                numberOfLines={4}
                maxLength={500}
                value={topics}
                onChangeText={setTopics}
              />

              <Text style={styles.label}>Number of Questions (Max 10)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="1-10"
                value={numQuestions?.toString() || ""}
                onChangeText={(val) => setNumQuestions(parseInt(val) || 0)}
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => topics.trim() && onGenerate()}
                >
                  <Text style={styles.generateButtonText}>
                    Generate Questions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
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
