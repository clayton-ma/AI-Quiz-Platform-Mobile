import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import { useEffect, useState } from "react";
import {
  Container,
  Group,
  Paper,
  Stack,
  ScrollArea,
  Button,
  Divider,
} from "@mantine/core";
import Pagination from "../../../components/ui/Pagination";
import { IconArrowLeft, IconPlayerPlay } from "@tabler/icons-react";
import LoadingState from "../../../components/ui/LoadingState";
import parseLinkHeader from "../../../utils/parseLinkHeader";
import { useNavigate, useParams } from "react-router-dom";
import ListAttemptTable from "../components/ListAttemptTable";
import { fetchAttemptsByQuizId, createAttempt } from "../api";
import { fetchQuizById } from "../../quiz/api";
import QuizDetails from "../components/QuizDetails";
import PageTitle from "../../../components/ui/PageTitle";

/**
 * ListAttemptPage component displays all attempts made by the user for a specific quiz.
 * It provides metadata about the quiz and the option to start a new attempt.
 */
export default function ListAttemptPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortBy, setSortBy] = useState("-updatedAt");
  const [filterStatus, setFilterStatus] = useState("All");
  const [quiz, setQuiz] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({});

  const { quizId } = useParams();
  const navigate = useNavigate();

  /**
   * Fetches the list of attempts and quiz metadata from the API.
   */
  const initAttempts = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: 10,
        sort: sortBy || "-updatedAt",
        status:
          filterStatus && filterStatus !== "All"
            ? filterStatus.toLowerCase()
            : undefined,
      };

      const response = await fetchAttemptsByQuizId(quizId, params);
      if (response) {
        setAttempts(response.data || []);
        const quiz = await fetchQuizById(quizId);
        setQuiz(quiz);

        const linkHeader = response.linkHeader || "";
        const links = parseLinkHeader(linkHeader);
        setPaginationLinks(links);
      }
    } catch (errors) {
      ShowErrorNotification(errors);
      navigate("/quiz");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new attempt for the current quiz and navigates to the attempt interface.
   */
  const handleStartNewAttempt = async () => {
    setActionLoading(true);
    try {
      const newAttempt = await createAttempt(quizId);
      navigate(`/attempt/take/${quizId}/${newAttempt._id}`);
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setActionLoading(false);
    }
  };

  // Re-fetch attempts when page or search criteria change
  useEffect(() => {
    initAttempts();
  }, [page, sortBy, filterStatus]);

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <PageTitle title="Attempts of this Quiz" backLink="/quiz">
          <Button
            color="blue"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={handleStartNewAttempt}
            loading={actionLoading}
            disabled={loading}
          >
            Start New Attempt
          </Button>
        </PageTitle>

        {/* Quiz Metadata Section */}
        <Stack gap={4}>
          <QuizDetails quiz={quiz} />
        </Stack>

        <Divider label="All attempts for this quiz" labelPosition="center" />

        {/* Attempts Data Table */}
        <Paper withBorder radius="md">
          <ScrollArea>
            {loading ? (
              <LoadingState py="xl" size="lg" />
            ) : (
              <ListAttemptTable
                attempts={attempts}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            )}
          </ScrollArea>
        </Paper>

        {/* Pagination Controls */}
        <Group justify="center" mt="md">
          <Pagination
            paginationLinks={paginationLinks}
            page={page}
            setPage={setPage}
          />
        </Group>
      </Stack>
    </Container>
  );
}
