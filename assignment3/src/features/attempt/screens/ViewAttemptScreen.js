import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Button,
} from "@mantine/core";
import { IconArrowLeft, IconCheck, IconLock } from "@tabler/icons-react";
import { fetchAttemptById } from "../api";
import { fetchQuizByIdForEdit, fetchQuizMetadata } from "../../quiz/api";
import ViewQuestionList from "../components/ViewQuestionList";
import LoadingState from "../../../components/ui/LoadingState";
import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import PageTitle from "../../../components/ui/PageTitle";

/**
 * ViewAttemptPage component displays the results and details of a specific quiz attempt.
 * It shows the score, timestamps, and a detailed review of questions and answers.
 */
export default function ViewAttemptPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

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
  if (loading) return <LoadingState />;
  if (!attempt || !quiz) return null;

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <PageTitle
          title="Attempt Details"
          backLink={`/attempt/quiz/${quiz._id}`}
        />

        {/* Attempt Summary Header */}
        <Paper withBorder p="lg" radius="md" shadow="sm">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Title order={2}>{quiz.name}</Title>
                <Text size="sm" c="dimmed">
                  Submitted on: {new Date(attempt.updatedAt).toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed">
                  Started on: {new Date(attempt.createdAt).toLocaleString()}
                </Text>
              </Stack>

              <Stack align="flex-end" gap="xs">
                <Badge size="xl" variant="filled" color="blue">
                  {attempt.status?.toUpperCase()}
                </Badge>
                <Badge
                  variant="light"
                  color={quiz.instant_result ? "green" : "orange"}
                  size="lg"
                  leftSection={
                    quiz.instant_result ? (
                      <IconCheck size={14} />
                    ) : (
                      <IconLock size={14} />
                    )
                  }
                >
                  {quiz.instant_result
                    ? "Results Released Instantly"
                    : "Results Hidden"}
                </Badge>
                {/* Display score if the attempt has been graded/submitted */}
                {attempt.status === "submitted" && (
                  <Paper withBorder px="md" py="xs" radius="md" bg="gray.0">
                    <Group gap="xs">
                      {quiz.instant_result ? (
                        <>
                          <Title order={4}>Score:</Title>
                          <Text fw={700} size="xl" c="blue">
                            {attempt.score !== null
                              ? attempt.score
                              : "Not Released"}
                          </Text>
                        </>
                      ) : (
                        <Text fw={500}>Score Hidden by Instructor</Text>
                      )}
                    </Group>
                  </Paper>
                )}
              </Stack>
            </Group>
          </Stack>
        </Paper>

        {/* Detailed Question Review Section */}
        {quiz.instant_result && quiz.questions && quiz.questions.length > 0 && (
          <>
            <Divider label="Question Review" labelPosition="center" />
            <ViewQuestionList
              questions={quiz.questions}
              selectedAnswers={attempt.answers}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
