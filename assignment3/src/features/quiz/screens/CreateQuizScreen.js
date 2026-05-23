import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Input, Button, Text, Icon, CheckBox } from "react-native-elements";
// import MultiSelect from "react-native-multiple-select";
import { createQuiz } from "../services/quizApi";
import { fetchGroups } from "../../group/services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import MainContainer from "../../../components/layout/MainContainer";
import { BackgroundColor } from "../../../../constants";
import EditQuizMetadata from "../components/EditQuizMetadata";
import CreateQuizForm from "../components/CreateQuizForm";

/**
 * CreateQuiz component provides a form for users to initialize a new quiz.
 */
export default function CreateQuiz({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instant_result: true,
    groupIds: [],
  });

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const { data: adminGroups } = await fetchGroups({ role: "admin" });

        if (adminGroups) {
          setGroupsData(
            adminGroups.map((g) => ({
              id: g._id,
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

  const handleSubmit = async () => {
    if (formData.name.length < 3) {
      return ShowErrorNotification({
        message: "Title must be at least 3 characters",
      });
    }
    if (formData.groupIds.length === 0) {
      return ShowErrorNotification({
        message: "Please select at least one group",
      });
    }

    setLoading(true);
    try {
      const { _id: quizId } = await createQuiz(formData);
      navigation.navigate("EditQuiz", { quizId });
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer title="Create New Quiz" navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <CreateQuizForm formData={formData} setFormData={setFormData} />
      </ScrollView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#86939e",
    marginBottom: 10,
    marginLeft: 10,
  },
  multiSelectContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  switchSub: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  submitBtn: {
    backgroundColor: BackgroundColor,
    borderRadius: 8,
    paddingVertical: 12,
  },
});
