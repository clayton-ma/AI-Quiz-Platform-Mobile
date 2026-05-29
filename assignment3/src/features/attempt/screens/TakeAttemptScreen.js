import { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { fetchAttemptById, updateAttempt } from "../services/attemptApi";
import { fetchQuizById } from "../../quiz/services/quizApi";
import AttemptDetails from "../components/AttemptDetails";
import AttemptQuestionList from "../components/AttemptQuestionList";
// import LoadingState from "../../../components/ui/LoadingState";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import ShowNotification from "../../../components/ui/ShowNotification";
import MainContainer from "../../../components/layout/MainContainer";

/**
 * TakeAttemptPage component allows users to answer questions in a quiz attempt.
 * It handles real-time answer state, saving progress, and final submission.
 */
export default function TakeAttemptPage({ route, navigation }) {
  const { quizId, attemptId } = route.params;

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Loads quiz metadata and existing attempt data on mount.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [quizData, attemptData] = await Promise.all([
          fetchQuizById(quizId),
          fetchAttemptById(attemptId),
        ]);
        setQuiz(quizData);
        setAttempt(attemptData);

        // Initialize local answers state from attempt data if it exists
        const initialAnswers = {};
        attemptData.answers?.forEach((ans) => {
          initialAnswers[ans.question_id] = ans.selected_option_id;
        });
        setAnswers(initialAnswers);
      } catch (errors) {
        ShowErrorNotification(errors);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [quizId, attemptId]);

  /**
   * Updates the local state when a user selects an option.
   */
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Formats the local answers object into the array format expected by the API
  const formatAnswers = () =>
    Object.entries(answers).map(([question_id, selected_option_id]) => ({
      question_id,
      selected_option_id,
    }));

  /**
   * Saves the current progress without finishing the attempt.
   */
  const handleSave = async () => {
    setActionLoading(true);
    try {
      await updateAttempt(attemptId, {
        action: "save",
        answers: formatAnswers(),
      });
      ShowNotification({
        title: "Success",
        message: "Progress saved",
        type: "success",
      });
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Submits the attempt for grading and redirects to the result view.
   */
  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      await updateAttempt(attemptId, {
        action: "submit",
        answers: formatAnswers(),
      });

      // Redirect to the view page to see results/score
      navigation.navigate("ViewAttempt", { attemptId });
    } finally {
      setActionLoading(false);
    }
  };

  // if (loading) return <LoadingState />;

  return (
    <MainContainer title="Take Attempt" navigation={navigation} isMain={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header with Quiz info and Action buttons */}
        <AttemptDetails
          quiz={quiz}
          attempt={attempt}
          onSave={handleSave}
          onSubmit={handleSubmit}
          loading={actionLoading}
        />

        {/* List of interactive questions */}
        <AttemptQuestionList
          questions={quiz?.questions}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          disabled={actionLoading}
        />
      </ScrollView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
