import React, { useEffect, useReducer, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { Icon, Button, Divider } from "react-native-elements";
import MainContainer from "../../../components/layout/MainContainer";
import {
  fetchQuizByIdForEdit,
  updateQuiz,
  publishQuiz,
} from "../services/quizApi";

import { fetchGroups } from "../../group/services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import ShowNotification from "../../../components/ui/ShowNotification";

import EditQuestionCard from "../components/EditQuestionCard";
import EditQuizMetadata from "../components/EditQuizMetadata";
import GenerateQuestionModal from "../components/GenerateQuestionModal";
import { useTheme } from "../../../app/providers/ThemeContext";

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
            temId: Math.random().toString(36).substring(7),
            content: "",
            options: [
              {
                temId: Math.random().toString(36).substring(7),
                content: "",
                is_correct: true,
              },
              {
                temId: Math.random().toString(36).substring(7),
                content: "",
                is_correct: false,
              },
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
            temId: Math.random().toString(36).substring(7),
            content: q.content || "",
            options: q.options
              ? q.options.map((o) => ({
                  temId: Math.random().toString(36).substring(7),
                  content: o.content || "",
                  is_correct: o.is_correct,
                }))
              : [
                  {
                    temId: Math.random().toString(36).substring(7),
                    content: "",
                    is_correct: false,
                  },
                  {
                    temId: Math.random().toString(36).substring(7),
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
export default function EditQuiz({ route, navigation }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);
  const { theme } = useTheme();
  const BackgroundColor = theme.colors.primary;
  const { quizId } = route.params;

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
          navigation.goBack();
          return;
        }

        // Fetch groups where user has admin privileges
        const groups = await fetchGroups({ role: "admin" });
        const groupsList = Array.isArray(groups?.data)
          ? groups.data
          : Array.isArray(groups)
            ? groups
            : [];
        setGroupsData(
          groupsList.map((g) => ({
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
                temId: q._id || Math.random().toString(36).substring(7),
                options: q.options.map((o) => ({
                  ...o,
                  temId: o._id || Math.random().toString(36).substring(7),
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
   * Saves current quiz state (metadata and questions) to the backend.
   */
  const saveQuiz = useCallback(async () => {
    try {
      const payload = {
        ...state.metadata,
        questions: state.questions,
      };
      console.log(payload);
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
      navigation.navigate("QuizList");
      ShowNotification({
        title: "Success",
        message: "Quiz published successfully",
        type: "success",
      });
    } catch (errors) {
      ShowErrorNotification(errors);
    }
  }, [saveQuiz, quizId, navigation]);

  /**
   * Calls AI API to generate questions based on user-provided topics.
   */

  if (loading && !state.metadata.name) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BackgroundColor} />
      </View>
    );
  }

  return (
    <MainContainer title="Edit Quiz" navigation={navigation}>
      <View style={[styles.topActionsContainer, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerActionsRow}>
          <Button
            title="Publish Quiz"
            type="outline"
            icon={
              <Icon
                name="rocket"
                type="font-awesome"
                size={15}
                color={BackgroundColor}
                style={{ marginRight: 5 }}
              />
            }
            onPress={() => {
              Alert.alert(
                "Confirm",
                "Publish this quiz? It cannot be edited after.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Publish", onPress: handlePublish },
                ],
              );
            }}
            buttonStyle={styles.actionBtn}
          />
          <Button
            title="Save Changes"
            icon={
              <Icon
                name="check"
                size={15}
                color="white"
                style={{ marginRight: 5 }}
              />
            }
            onPress={saveQuiz}
            buttonStyle={[
              styles.actionBtn,
              { backgroundColor: BackgroundColor },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <EditQuizMetadata
          metadata={state.metadata}
          dispatch={dispatch}
          groupsData={groupsData}
        />

        <Divider style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Questions ({state.questions.length})
          </Text>
          <TouchableOpacity
            onPress={() => setGenerateOpen(true)}
            style={styles.aiButton}
          >
            <Icon name="auto-fix-high" color={BackgroundColor} size={20} />
            <Text style={styles.aiButtonText}>AI Generate</Text>
          </TouchableOpacity>
        </View>

        {state.questions.map((q, index) => (
          <EditQuestionCard
            key={q.temId || index}
            q={q}
            index={index}
            dispatch={dispatch}
          />
        ))}

        <Button
          title="Add Question Manually"
          type="outline"
          icon={<Icon name="add" color={BackgroundColor} />}
          onPress={addQuestion}
          containerStyle={styles.addBtnContainer}
          buttonStyle={{ borderColor: BackgroundColor }}
          titleStyle={{ color: BackgroundColor }}
        />
      </ScrollView>

      <GenerateQuestionModal
        opened={generateOpen}
        onClose={() => setGenerateOpen(false)}
        loading={loading}
        dispatch={dispatch}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 15, paddingBottom: 40 },
  topActionsContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 20,
    minWidth: 150,
  },
  divider: { marginVertical: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  aiButton: { flexDirection: "row", alignItems: "center" },
  aiButtonText: { color: "red", marginLeft: 5, fontWeight: "600" },
  addBtnContainer: { marginTop: 20 },
});
