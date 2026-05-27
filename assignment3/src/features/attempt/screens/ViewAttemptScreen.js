import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Badge, Divider, Card } from "react-native-elements";
import { fetchAttemptById } from "../services/attemptApi";
import {
  fetchQuizByIdForEdit,
  fetchQuizMetadata,
} from "../../quiz/services/quizApi";
import ViewQuestionList from "../components/ViewQuestionList";
// import LoadingState from "../../../components/ui/LoadingState";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import MainContainer from "../../../components/layout/MainContainer";
import { BackgroundColor } from "../../../../constants";

/**
 * ViewAttemptPage component displays the results and details of a specific quiz attempt.
 * It shows the score, timestamps, and a detailed review of questions and answers.
 */
export default function ViewAttemptScreen({ route, navigation }) {
  const { attemptId } = route.params;

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Loads the attempt data and associated quiz metadata on component mount.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const attemptData = await fetchAttemptById(attemptId);
        setAttempt(attemptData);
        let quizData = await fetchQuizMetadata(attemptData.quiz_id);

        if (quizData.instant_result) {
          quizData = await fetchQuizByIdForEdit(attemptData.quiz_id);
        }
        setQuiz(quizData);
      } catch (errors) {
        ShowErrorNotification(errors);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [attemptId]);

  // Show loading state while fetching data, and return null if attempt or quiz data is not available
  // if (loading) return <LoadingState />;
  if (!attempt || !quiz) return null;

  return (
    <MainContainer title="Attempt Details" navigation={navigation}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Attempt Summary Header */}
        <Card containerStyle={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text h4 style={styles.quizName}>
                {quiz.name}
              </Text>
              <Text style={styles.dateText}>
                Submitted: {new Date(attempt.updatedAt).toLocaleString()}
              </Text>
            </View>
            <Badge
              value={attempt.status?.toUpperCase()}
              status="primary"
              badgeStyle={styles.statusBadge}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.scoreContainer}>
            {attempt.status === "submitted" &&
              (quiz.instant_result ? (
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Final Score</Text>
                  <Text style={styles.scoreValue}>
                    {attempt.score !== null ? attempt.score : "N/A"}
                  </Text>
                </View>
              ) : (
                <Text style={styles.hiddenScoreText}>
                  Score Hidden by Instructor
                </Text>
              ))}
          </View>
        </Card>

        {/* Detailed Question Review Section */}
        {quiz.instant_result && quiz.questions && quiz.questions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Question Review</Text>
            <ViewQuestionList
              questions={quiz.questions}
              selectedAnswers={attempt.answers}
            />
          </>
        )}
      </ScrollView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  quizName: {
    color: "#2C3E50",
    marginBottom: 5,
  },
  dateText: {
    color: "#7F8C8D",
    fontSize: 12,
  },
  statusBadge: {
    height: 30,
    paddingHorizontal: 10,
  },
  divider: {
    marginVertical: 15,
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: BackgroundColor,
  },
  hiddenScoreText: {
    fontStyle: "italic",
    color: "#95A5A6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginVertical: 15,
    marginLeft: 5,
  },
});
