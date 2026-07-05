/**
 * @file ListAttemptScreen.jsx
 * @description Screen component for viewing all attempts of a specific quiz and initiating new ones.
 */
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Icon } from "@rneui/themed";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import MainContainer from "../../../components/layout/MainContainer";
import { createAttempt } from "../services/attemptApi";
import { useTheme } from "../../../app/providers/ThemeContext";
import QuizDetails from "../components/QuizDetails";
import ListAttemptTable from "../components/ListAttemptTable";
import ExportQuizButton from "../components/ExportQuiz";

/**
 * ListAttemptScreen component displays all attempts made by the user for a specific quiz.
 *
 * It provides a summary of the quiz, an option to export quiz data,
 * and a list of previous attempts with their statuses and scores.
 *
 * @param {Object} props - Component props
 * @param {Object} props.route - React Navigation route object containing quizId
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered attempt list screen.
 */
export default function ListAttemptScreen({ route, navigation }) {
  const { quizId } = route.params;
  const [actionLoading, setActionLoading] = useState(false);
  const { theme } = useTheme();

  /** Handles the creation of a new quiz attempt and navigates to the taking screen */
  const handleStartNewAttempt = async () => {
    setActionLoading(true);
    try {
      const newAttempt = await createAttempt(quizId);
      navigation.navigate("TakeAttempt", { quizId, attemptId: newAttempt._id });
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainContainer title="Quiz Attempts" navigation={navigation} isMain={false}>
      <View style={styles.container}>
        {/* Quiz Header and Actions Section */}
        <View style={styles.glassWrapper}>
          <View
            style={[
              styles.glassContainer,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}
          >
            <QuizDetails quizId={quizId} />

            {/* Export Functionality */}
            <View style={styles.exportWrapper}>
              <ExportQuizButton quizId={quizId} />
            </View>

            {/* Start Attempt Action */}
            <Button
              title="Start New Attempt"
              icon={
                <Icon
                  name="play-arrow"
                  color="white"
                  style={{ marginRight: 8 }}
                />
              }
              onPress={handleStartNewAttempt}
              loading={actionLoading}
              buttonStyle={[
                styles.startBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              containerStyle={styles.btnContainer}
            />
          </View>
        </View>

        {/* History Table Section */}
        <View style={styles.tableSection}>
          <ListAttemptTable quizId={quizId} />
        </View>
      </View>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  glassWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  glassContainer: {
    padding: 20,
    borderWidth: 1,
  },
  startBtn: {
    borderRadius: 12,
    height: 50,
  },
  exportWrapper: {
    marginBottom: 15,
  },
  btnContainer: { marginTop: 10 },
  tableSection: { flex: 1 },
});
