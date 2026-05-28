import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Text } from "react-native";
import { Button, Icon, Divider } from "react-native-elements";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
// import LoadingState from "../../../components/ui/LoadingState";
import MainContainer from "../../../components/layout/MainContainer";
import { fetchAttemptsByQuizId, createAttempt } from "../services/attemptApi";
import { fetchQuizById } from "../../quiz/services/quizApi";
// import QuizDetails from "../components/QuizDetails";
import AttemptItem from "../components/ListAttemptRow";
import ListFooter from "../../../components/ui/ListFooter";
import { useTheme } from "../../../app/providers/ThemeContext";
import QuizDetails from "../components/QuizDetails";
import ListAttemptTable from "../components/ListAttemptTable";

/**
 * ListAttemptScreen component displays all attempts made by the user for a specific quiz.
 */
export default function ListAttemptScreen({ route, navigation }) {
  const { quizId } = route.params;
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  const loadQuizDetails = useCallback(async () => {
    try {
      const quizData = await fetchQuizById(quizId);
      setQuiz(quizData);
    } catch (errors) {
      ShowErrorNotification(errors);
    }
  }, [quizId]);

  return (
    <MainContainer title="Quiz Attempts" navigation={navigation}>
      <QuizDetails quizId={quizId} />
      <Button
        title="Start New Attempt"
        icon={
          <Icon name="play-arrow" color="white" style={{ marginRight: 5 }} />
        }
        onPress={handleStartNewAttempt}
        loading={actionLoading}
        buttonStyle={[styles.startBtn, { backgroundColor: theme.colors.primary }]}
      />

      <ListAttemptTable quizId={quizId} />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
  },
  startBtn: {
    borderRadius: 8,
    marginTop: 15,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});
