import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import MainContainer from "../../../components/layout/MainContainer";
import FormContainer from "../../../components/ui/FormContainer";
import { createGroup } from "../services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import ShowNotification from "../../../components/ui/ShowNotification";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * CreateGroupScreen component provides a form for users to create a new group.
 * Upon successful creation, it navigates to the EditGroup screen.
 */
export default function CreateGroupScreen({ navigation, visible, onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleCreate = async () => {
    if (!name.trim()) {
      return ShowNotification({
        title: "Validation Error",
        message: "Group name is required",
        type: "error",
      });
    }

    setLoading(true);
    try {
      const newGroup = await createGroup({ name: name.trim() });

      ShowNotification({
        title: "Success",
        message: "Group created successfully",
        type: "success",
      });

      // Navigate to EditGroup to allow adding members or further configuration
      navigation.navigate("EditGroup", {
        groupId: newGroup,
      });
      if (onClose) onClose();
    } catch (error) {
      ShowErrorNotification(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Create New Group
              </Text>
              <Icon name="close" onPress={onClose} color={theme.colors.text} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
              <View>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Group Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Icon
                    name="groups"
                    type="material"
                    color="#7F8C8D"
                    size={20}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Enter group name (e.g. CS101 Section A)"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={theme.colors.textInput}
                    editable={!loading}
                  />
                </View>

                <Button
                  title="Create Group"
                  loading={loading}
                  onPress={handleCreate}
                  buttonStyle={[
                    styles.button,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  containerStyle={styles.buttonContainer}
                />
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    width: "100%",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  modalTitle: {
    fontSize: 20,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    height: 50,
  },
});
