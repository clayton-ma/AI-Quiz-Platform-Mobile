import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Input, Button, Text, Icon, CheckBox } from "react-native-elements";
import MultiSelect from "react-native-multiple-select";
import { createQuiz } from "../api";
import { fetchGroups } from "../../group/api";
import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import MainContainer from "../../../components/layout/MainContainer";
import { BackgroundColor } from "../../../../constants";

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
        <View style={styles.formCard}>
          <Input
            label="Quiz Title *"
            placeholder="Initial Quiz Title"
            value={formData.name}
            onChangeText={(val) => setFormData({ ...formData, name: val })}
            leftIcon={<Icon name="info-outline" size={20} color="#7F8C8D" />}
            disabled={loading}
          />

          <Input
            label="Description"
            placeholder="Description of the quiz"
            value={formData.description}
            onChangeText={(val) =>
              setFormData({ ...formData, description: val })
            }
            multiline
            numberOfLines={3}
            disabled={loading}
          />

          <View style={styles.multiSelectContainer}>
            <Text style={styles.label}>Assign to Groups *</Text>
            <MultiSelect
              items={groupsData}
              uniqueKey="id"
              onSelectedItemsChange={(val) =>
                setFormData({ ...formData, groupIds: val })
              }
              selectedItems={formData.groupIds}
              selectText="Select one or more groups"
              searchInputPlaceholderText="Search Groups..."
              tagRemoveIconColor={BackgroundColor}
              tagBorderColor={BackgroundColor}
              tagTextColor={BackgroundColor}
              selectedItemTextColor={BackgroundColor}
              selectedItemIconColor={BackgroundColor}
              itemTextColor="#000"
              displayKey="label"
              searchInputStyle={{ color: "#CCC" }}
              submitButtonColor={BackgroundColor}
              submitButtonText="Confirm"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>
                Show instant results to students
              </Text>
              <Text style={styles.switchSub}>
                Students will see their score immediately after submission
              </Text>
            </View>
            <Switch
              value={formData.instant_result}
              onValueChange={(val) =>
                setFormData({ ...formData, instant_result: val })
              }
              trackColor={{ false: "#767577", true: BackgroundColor }}
              disabled={loading}
            />
          </View>

          <Button
            title="Create Quiz"
            loading={loading}
            onPress={handleSubmit}
            buttonStyle={styles.submitBtn}
            icon={<Icon name="add" color="white" style={{ marginRight: 10 }} />}
          />
        </View>
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
