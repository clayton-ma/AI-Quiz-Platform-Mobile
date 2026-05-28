import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Icon } from "react-native-elements";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import MainContainer from "../../../components/layout/MainContainer";
import { createAttempt } from "../services/attemptApi";
import { useTheme } from "../../../app/providers/ThemeContext";
import QuizDetails from "../components/QuizDetails";
import ListAttemptTable from "../components/ListAttemptTable";

/**
 * ListAttemptScreen component displays all attempts made by the user for a specific quiz.
 */
export default function ListAttemptScreen({ route, navigation }) {
  const { quizId } = route.params;
  const [actionLoading, setActionLoading] = useState(false);
  const { theme } = useTheme();

  /**
   * Creates a new attempt for the current quiz and navigates to the attempt interface.
   */
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
    <MainContainer title="Quiz Attempts" navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.glassWrapper}>
          <View
            style={[
              styles.glassContainer,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
            ]}
          >
            <QuizDetails quizId={quizId} />
            
            <Button
              title="Start New Attempt"
              icon={
                <Icon name="play-arrow" color="white" style={{ marginRight: 8 }} />
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
  btnContainer: { marginTop: 10 },
  tableSection: { flex: 1 },
});
