import { useEffect, useReducer, useCallback, useState } from "react";
import {
  Container,
  Button,
  Group,
  Stack,
  Title,
  Divider,
  Text,
} from "@mantine/core";
import {
  IconPlus,
  IconDeviceFloppy,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";

import {
  fetchQuizByIdForEdit,
  generateQuestions,
  updateQuiz,
  publishQuiz,
} from "../api";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { fetchGroups } from "../../group/api";
import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import ShowNotification from "@/components/ui/ShowNotification";

import EditQuestionCard from "../components/EditQuestionCard";
import EditQuizMetadata from "../components/EditQuizMetadata";
import GenerateQuestionModal from "../components/GenerateQuestionModal";

/**
 * Initial state structure for the quiz being edited.
 */
const initialState = {
  metadata: {
    name: "",
    description: "",
    groupIds: [],
    instant_result: false,
    status: "draft",
  },
  questions: [],
};

/**
 * Reducer function to manage quiz state updates.
 * Handles complex nested structures for metadata and questions.
 */
function reducer(state, action) {
  switch (action.type) {
    case "SET_QUIZ":
      // Replace entire state when loading from server
      return {
        ...state,
        metadata: {
          ...state.metadata,
          temId: action.payload.temId,
          name: action.payload.name,
          description: action.payload.description,
          groupIds: action.payload.groupIds,
          instant_result: action.payload.instant_result,
          status: action.payload.status,
        },
        questions: action.payload.questions,
      };

    case "SET_METADATA":
      // Update quiz-level settings
      return { ...state, metadata: { ...state.metadata, ...action.payload } };

    case "ADD_QUESTION":
      // Append a single blank question
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            temId: crypto.randomUUID(), // Let MongoDB generate a valid ObjectId
            content: "",
            options: [
              { temId: crypto.randomUUID(), content: "", is_correct: true },
              { temId: crypto.randomUUID(), content: "", is_correct: false },
            ],
          },
        ],
      };

    case "ADD_QUESTIONS":
      // Bulk add questions (usually from AI generator)
      return {
        ...state,
        questions: [
          ...state.questions,
          ...action.payload.map((q) => ({
            temId: crypto.randomUUID(),
            content: q.content || "",
            options: q.options
              ? q.options.map((o) => ({
                  temId: crypto.randomUUID(),
                  content: o.content || "",
                  is_correct: o.is_correct,
                }))
              : [
                  {
                    temId: crypto.randomUUID(),
                    content: "",
                    is_correct: false,
                  },
                  {
                    temId: crypto.randomUUID(),
                    content: "",
                    is_correct: false,
                  },
                ],
          })),
        ],
      };

    case "DELETE_QUESTION":
      // Remove question by temporary ID
      return {
        ...state,
        questions: state.questions.filter((q) => q.temId !== action.payload),
      };

    case "SYNC_QUESTION":
      // Update a specific question's content/options
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.temId === action.payload.temId ? action.payload : q,
        ),
      };

    case "SET_QUESTIONS":
      // Overwrite all questions
      return {
        ...state,
        questions: action.payload,
      };

    default:
      return state;
  }
}

/**
 * EditQuizPage component provides a comprehensive interface for instructors to
 * modify quiz settings, manage questions manually, or generate them using AI.
 */
export default function EditQuizPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [topics, setTopics] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Load quiz and group data on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const quiz = await fetchQuizByIdForEdit(quizId);

        // Prevent editing published quizzes
        if (quiz.status === "published") {
          ShowNotification({
            title: "Access Denied",
            message: "Published quizzes cannot be edited.",
            type: "error",
          });
          return navigate(`/quiz/attempt/${quizId}`);
        }

        // Fetch groups where user has admin privileges
        const groups = await fetchGroups({ role: "admin" });
        setGroupsData(
          groups.data.map((g) => ({
            value: g._id,
            label: g.name,
          })),
        );

        // Initialize reducer state with server data
        dispatch({
          type: "SET_QUIZ",
          payload: {
            name: quiz.name || "",
            description: quiz.description || "",
            temId: quiz._id || undefined,
            groupIds: quiz.groups || [],
            instant_result: quiz.instant_result ?? true,
            status: quiz.status || "draft",
            questions:
              quiz.questions.map((q) => ({
                ...q,
                temId: q._id || crypto.randomUUID(),
                options: q.options.map((o) => ({
                  ...o,
                  temId: o._id || crypto.randomUUID(),
                })),
              })) || [],
          },
        });
      } catch (errors) {
        ShowErrorNotification(errors);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  /**
   * Dispatches action to add a blank question.
   */
  const addQuestion = useCallback(() => {
    dispatch({ type: "ADD_QUESTION" });
  }, []);

  /**
   * Calls AI API to generate questions based on user-provided topics.
   */
  const handleGenerateQuestions = useCallback(async () => {
    try {
      setLoading(true);

      const res = await generateQuestions(topics, numQuestions);

      if (!res || !res.questions) {
        throw new Error("Failed to generate questions. Please try again.");
      }

      dispatch({
        type: "ADD_QUESTIONS",
        payload: res.questions,
      });

      ShowNotification({
        title: "Success",
        message: "Questions generated successfully",
        type: "success",
      });
      setGenerateOpen(false);
    } catch (err) {
      ShowErrorNotification(err);
    } finally {
      setLoading(false);
    }
  }, [topics, numQuestions, quizId]);

  /**
   * Saves current quiz state (metadata and questions) to the backend.
   */
  const saveQuiz = useCallback(async () => {
    try {
      const payload = {
        ...state.metadata,
        questions: state.questions,
      };

      await updateQuiz(quizId, payload);

      ShowNotification({
        title: "Success",
        message: "Quiz saved successfully",
        type: "success",
      });
    } catch (errors) {
      ShowErrorNotification(errors);
    }
  }, [state, quizId]);

  /**
   * Saves and then publishes the quiz, making it live for students.
   */
  const handlePublish = useCallback(async () => {
    try {
      await saveQuiz();
      await publishQuiz(quizId);
      navigate(`/attempt/quiz/${quizId}`);
      ShowNotification({
        title: "Success",
        message: "Quiz published successfully",
        type: "success",
      });
    } catch (errors) {
      ShowErrorNotification(errors);
    }
  }, [saveQuiz, quizId, navigate]);

  return (
    <Container size="md" py="xl">
      {/* AI Generation Interface */}
      <GenerateQuestionModal
        opened={generateOpen}
        onClose={() => setGenerateOpen(false)}
        topics={topics}
        setTopics={setTopics}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        onGenerate={handleGenerateQuestions}
        loading={loading}
      />

      {/* Final Publication Confirmation */}
      <ConfirmDialog
        opened={confirmPublishOpen}
        onClose={() => setConfirmPublishOpen(false)}
        onConfirm={() => {
          setConfirmPublishOpen(false);
          handlePublish();
        }}
        title="Confirm Action"
        message="Do you want to save and publish the quiz? Once published, the quiz cannot be edited."
        confirmLabel="Confirm"
        confirmColor="red"
        loading={loading}
      />

      {/* Header Actions */}
      <PageTitle title="Edit Quiz" backLink="/quiz">
        <Group>
          <Button
            variant="outline"
            color="blue"
            leftSection={<IconRocket size={18} />}
            onClick={() => setConfirmPublishOpen(true)}
            loading={loading}
          >
            Publish
          </Button>

          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            onClick={saveQuiz}
            loading={loading}
          >
            Save Changes
          </Button>
        </Group>
      </PageTitle>

      <Stack gap="xl">
        {/* Quiz Settings Section */}
        <EditQuizMetadata
          metadata={state.metadata}
          dispatch={dispatch}
          groupsData={groupsData}
        />

        <Divider label="Questions" labelPosition="center" />

        {/* Questions Management Section */}
        <Group justify="space-between">
          <Title order={4}>Quiz Questions ({state.questions.length})</Title>
          <Button
            variant="light"
            leftSection={<IconSparkles size={18} />}
            onClick={() => setGenerateOpen(true)}
          >
            AI Generator
          </Button>
        </Group>

        {/* List of Question Cards */}
        <Stack gap="md">
          {state.questions.map((q, index) => (
            <EditQuestionCard
              key={q.temId || index}
              q={q}
              index={index}
              dispatch={dispatch}
            />
          ))}

          {/* Manual Addition Trigger */}
          <Button
            variant="outline"
            leftSection={<IconPlus size={18} />}
            onClick={addQuestion}
            fullWidth
            mt="md"
          >
            Add Question Manually
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
