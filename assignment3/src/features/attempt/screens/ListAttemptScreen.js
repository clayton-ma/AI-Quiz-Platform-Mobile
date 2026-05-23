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
import { BackgroundColor } from "../../../../constants";
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

  /**
   * Fetches the list of attempts and quiz metadata from the API.
   */
  const loadAttempts = useCallback(
    async (pageNum, isRefresh = false) => {
      if (loading && !isRefresh) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {
          page: pageNum,
          limit: 10,
          sort: "-updatedAt",
        };

        const response = await fetchAttemptsByQuizId(quizId, params);
        if (response) {
          const { data: newAttempts, linkHeader } = response;
          setAttempts((prev) =>
            isRefresh ? newAttempts : [...prev, ...newAttempts],
          );
          setHasMore(!!linkHeader.next);
          setPage(pageNum);

          if (!quiz) {
            const quizData = await fetchQuizById(quizId);
            setQuiz(quizData);
          }
        }
      } catch (errors) {
        ShowErrorNotification(errors);
        navigation.goBack();
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [quizId, quiz, loading],
  );

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

  useEffect(() => {
    loadAttempts(1, true);
  }, []);

  const onRefresh = () => loadAttempts(1, true);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadAttempts(page + 1);
    }
  };

  // if (loading && page === 1 && !refreshing) return <LoadingState />;

  return (
    <MainContainer title="Quiz Attempts" navigation={navigation}>
      <QuizDetails quiz={quiz} />
      <Button
        title="Start New Attempt"
        icon={
          <Icon name="play-arrow" color="white" style={{ marginRight: 5 }} />
        }
        onPress={handleStartNewAttempt}
        loading={actionLoading}
        buttonStyle={styles.startBtn}
      />

      <ListAttemptTable />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
  },
  startBtn: {
    backgroundColor: BackgroundColor,
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
