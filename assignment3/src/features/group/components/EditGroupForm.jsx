/**
 * @file EditGroupForm.jsx
 * @description Component for editing group details, managing members, and administrative roles.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchGroupById, updateGroup, deleteGroup } from "../services/groupApi";
import { useTheme } from "../../../app/providers/ThemeContext";
import { isValidEmail } from "../../../utils/validationFunction";
import ShowNotification from "../../../components/ui/ShowNotification";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";

/**
 * EditGroupForm component.
 *
 * Provides an interface for group administrators to update group names,
 * manage member roles (promote to admin), add new members by email,
 * and delete the group entirely.
 *
 * @param {Object} props - Component props
 * @param {string} props.groupId - The ID of the group to edit
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered edit group form.
 */
export default function EditGroupForm({ groupId, navigation }) {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [membersToMerge, setMembersToMerge] = useState([]); // Tracks additions/role changes for API
  const [membersToDelete, setMembersToDelete] = useState([]); // Tracks removals for API

  /** Fetches group details and initializes local state on mount */
  useEffect(() => {
    const initGroupDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchGroupById(groupId);

        const groupAdmins = response.members
          .filter((m) => m.role === "admin")
          .map((m) => ({ ...m.user }));

        const groupMembers = response.members
          .filter((m) => m.role === "member")
          .map((m) => ({ ...m.user }));

        setName(response.name);
        setAdmins(groupAdmins);
        setMembers(groupMembers);
      } catch (errors) {
        ShowErrorNotification(errors);
      } finally {
        setLoading(false);
      }
    };
    initGroupDetails();
  }, []);

  /**
   * Adds a new member to the local form state.
   * Validates email format and checks for duplicates before adding.
   */
  const handleAddMember = () => {
    const email = newEmail?.trim();
    if (!email) return;

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }
    setEmailError("");

    // Check for duplicates in both members and admins lists
    const isDuplicate =
      members.some((m) => m.email.toLowerCase() === email.toLowerCase()) ||
      admins.some((a) => a.email.toLowerCase() === email.toLowerCase());

    // If duplicate, show error notification and do not add to form
    if (isDuplicate) {
      ShowNotification({
        id: "duplicate-email",
        title: "Email already exists",
        message: "This user is already a member or admin of this group.",
        type: "error",
      });
      return;
    }
    if (membersToDelete.includes(email)) {
      // If the email was previously marked for deletion, unmark it and do not add to form (since they are still in the group until saved)
      setMembersToDelete(membersToDelete.filter((e) => e !== email));
    }

    // Add to membersToMerge for API
    setMembersToMerge([...membersToMerge, { email: email, role: "member" }]);
    setMembers([...members, { email, firstname: "", lastname: "" }]);
    setNewEmail("");
  };

  /**
   * Moves a user from the members list to the admins list locally.
   * @param {string} email - The email of the user to promote
   */
  const handlePromoteToAdmin = (email) => {
    // Find the member in the members list
    const memberToPromote = members.find((m) => m.email === email);
    // If member not found (shouldn't happen), do nothing
    if (!memberToPromote) return;

    // Change role in membersToMerge to admin if they were just added as a member, then add them as an admin in membersToMerge
    const newMembers = members.filter((m) => m.email !== email);
    const filteredMerge = membersToMerge.filter(
      (m) => m.email.toLowerCase() !== email.toLowerCase(),
    );
    setMembersToMerge([...filteredMerge, { email: email, role: "admin" }]);
    setMembers(newMembers);
    setAdmins([...admins, memberToPromote]);
  };

  /**
   * Removes a user from the local lists and tracks them for deletion in the API call.
   * @param {string} email - User email
   * @param {boolean} isAdmin - Whether the user is currently in the admin list
   */
  const handleRemoveUser = (email, isAdmin) => {
    if (isAdmin) {
      // Prevent removing the last admin
      if (admins.length === 1) {
        ShowNotification({
          id: "last-admin",
          title: "Last Admin",
          message: "You must have at least one admin.",
          type: "error",
        });
        return;
      }

      // Remove from admins
      const newAdmins = admins.filter((a) => a.email !== email);
      setAdmins(newAdmins);
    } else {
      // Remove from members
      const newMembers = members.filter((m) => m.email !== email);
      setMembers(newMembers);
    }

    // Track deletion (for BOTH admins and members)
    setMembersToDelete((prev) => {
      if (prev.includes(email)) return prev; // prevent duplicates
      return [...prev, email];
    });
  };

  /**
   * Validates and submits the updated group data to the backend.
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      const groupDetails = {
        name: name,
        membersToMerge: membersToMerge,
        membersToDelete: membersToDelete,
      };
      // Call API to update group with new name, added/updated members, and removed members
      await updateGroup(groupId, groupDetails);
      ShowNotification({
        id: "group-updated",
        title: "Group Updated",
        message: "The group has been updated successfully.",
        type: "success",
      });
      // Reset form values
      setMembersToDelete([]);
      setMembersToMerge([]);
      navigation.goBack();
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes the entire group via the API.
   */
  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      // Call API to delete group by ID, then navigate back to group list on success
      await deleteGroup(groupId);
      ShowNotification({
        id: "group-deleted",
        title: "Group Deleted",
        message: "The group has been successfully removed.",
        type: "success",
      });
      navigation.navigate("GroupList");
    } catch (errors) {
      ShowErrorNotification(errors);
      setLoading(false);
    }
  };

  /**
   * Displays a confirmation alert before deleting the group.
   */
  const confirmDelete = () => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteGroup },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Edit Group Settings
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Group Name
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
          placeholderTextColor="#999"
        />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Add Member
        </Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="user@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleAddMember}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Admins
        </Text>
        {admins.map((admin) => (
          <View key={admin.email} style={styles.memberRow}>
            <Text style={{ color: theme.colors.text }}>{admin.email}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveUser(admin.email, true)}
            >
              <Text
                style={[
                  styles.removeText,
                  { color: theme.colors.error || "#fa5252" },
                ]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Members
        </Text>
        {members.map((member) => (
          <View key={member.email} style={styles.memberRow}>
            <Text style={{ color: theme.colors.text }}>{member.email}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => handlePromoteToAdmin(member.email)}
              >
                <Text
                  style={[styles.promoteText, { color: theme.colors.primary }]}
                >
                  Promote
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveUser(member.email, false)}
              >
                <Text
                  style={[
                    styles.removeText,
                    { marginLeft: 10, color: theme.colors.error || "#fa5252" },
                  ]}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.deleteButton,
          {
            backgroundColor: theme.dark ? "rgba(250, 82, 82, 0.1)" : "#fff0f0",
            borderColor: theme.colors.error || "#fa5252",
          },
        ]}
        onPress={confirmDelete}
      >
        <Text
          style={[
            styles.deleteButtonText,
            {
              color: theme.colors.alertButtonText,
            },
          ]}
        >
          Delete Group
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  saveButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  row: { flexDirection: "row", alignItems: "center" },
  addButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  errorText: { color: "#fa5252", fontSize: 12, marginTop: 5 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  removeText: { fontWeight: "500" },
  promoteText: { fontWeight: "500" },
  deleteButton: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  deleteButtonText: { fontWeight: "bold" },
});
