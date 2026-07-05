import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import CreateQuizForm from "../components/CreateQuizForm";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * CreateQuiz Screen.
 *
 * This screen serves as the entry point for creating a new quiz.
 * It provides a layout wrapper using MainContainer and renders the
 * CreateQuizForm to handle the actual data input and submission logic.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered Create Quiz screen.
 */
export default function CreateQuiz({ navigation }) {
  const { theme } = useTheme();

  /**
   * Local state for the quiz creation form.
   * Initialized with default values for metadata.
   */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instant_result: true,
    groupIds: [],
  });

  return (
    <MainContainer
      title="Create New Quiz"
      navigation={navigation}
      isMain={false}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <CreateQuizForm formData={formData} setFormData={setFormData} />
      </ScrollView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});
