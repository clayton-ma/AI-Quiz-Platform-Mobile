import {
  TextInput,
  Textarea,
  Switch,
  MultiSelect,
  Button,
  Stack,
  Group,
  Container,
  Paper,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import {
  IconPlus,
  IconArrowLeft,
  IconUsers,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../api";
import { fetchGroups } from "../../group/api";
import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import PageTitle from "../../../components/ui/PageTitle";

/**
 * CreateQuiz component provides a form for users to initialize a new quiz.
 * It requires the user to be an admin of at least one group to assign the quiz.
 */
export default function CreateQuiz() {
  const [loading, setLoading] = useState(false); // Controls loading state for API calls
  const [groupsData, setGroupsData] = useState([]); // Stores formatted groups where user is admin
  const navigate = useNavigate();

  // Initialize form with validation
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      instant_result: true,
      groupIds: [],
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Title must be at least 3 characters" : null,
      groupIds: (value) =>
        value.length === 0 ? "Please select at least one group" : null,
    },
  });

  // Fetch groups where the current user has admin privileges on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const { data: adminGroups } = await fetchGroups({ role: "admin" });

        if (adminGroups) {
          // Format data for Mantine MultiSelect
          setGroupsData(
            adminGroups.map((g) => ({
              value: g._id,
              label: g.name,
            })),
          );
        }
      } catch (errors) {
        ShowErrorNotification(errors);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  /**
   * Handles the quiz creation submission.
   * On success, redirects the user to the quiz editor to add questions.
   * @param {Object} values - Validated form values
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    if (form.validate().hasErrors) {
      setLoading(false);
      return;
    }

    try {
      // Create quiz and navigate to edit page to add questions
      const { _id: quizId } = await createQuiz(values);
      navigate(`/quiz/edit-quiz/${quizId}`);
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        {/* Reusable page header with back navigation to quiz list */}
        <PageTitle title="Create New Quiz" backLink="/quiz" />

        <Paper withBorder p="xl" radius="md" shadow="sm">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Quiz Title"
                placeholder="Initial Quiz Title"
                required
                disabled={loading}
                leftSection={<IconInfoCircle size={16} />}
                {...form.getInputProps("name")}
              />

              {/* Optional description for the quiz context */}
              <Textarea
                label="Description"
                placeholder="Description of the quiz"
                minRows={3}
                disabled={loading}
                {...form.getInputProps("description")}
              />

              {/* Group assignment is mandatory for quiz visibility */}
              <MultiSelect
                label="Assign to Groups"
                placeholder="Select one or more groups"
                leftSection={<IconUsers size={16} />}
                data={groupsData}
                required
                disabled={loading}
                nothingFoundMessage={
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => navigate("/group/create-group")}
                  >
                    No admin groups found. Create one?
                  </Button>
                }
                description={
                  groupsData.length === 0
                    ? "You need to be an admin of a group to create a quiz."
                    : null
                }
                {...form.getInputProps("groupIds")}
              />

              {/* Toggle for immediate feedback after student submission */}
              <Switch
                label="Show instant results to students"
                description="Students will see their score immediately after submission"
                disabled={loading}
                {...form.getInputProps("instant_result", { type: "checkbox" })}
              />

              {/* Submission button triggers form validation and API call */}
              <Group justify="flex-end" mt="md">
                <Button
                  fullWidth
                  size="md"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  leftSection={<IconPlus size={20} />}
                >
                  Create Quiz
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}
