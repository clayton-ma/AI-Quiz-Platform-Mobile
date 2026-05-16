import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, TextInput, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import UserAvatar from "../../../components/ui/UserAvatar";
import { isValidName } from "../../../utils/validationFunction";
import { SaveButton } from "../../../components/ui/Button";
import { useAuth } from "../../../app/providers/AuthContext";
import { updateUser } from "../services/userApi";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * ProfileForm component allows users to view and update their personal information.
 * It handles name updates and provides a link to the password change page.
 */
export default function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!isValidName(formData.firstname)) newErrors.firstname = "Invalid first name";
    if (!isValidName(formData.lastname)) newErrors.lastname = "Invalid last name";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the profile update submission.
   */
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await updateUser({
        firstname: formData.firstname,
        lastname: formData.lastname,
      });

      Alert.alert("Success", "Account updated successfully.");
      await refreshUser();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar
          firstname={formData.firstname}
          lastname={formData.lastname}
          size={100}
        />
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        value={formData.firstname}
        onChangeText={(text) => setFormData({ ...formData, firstname: text })}
        style={[styles.input, errors.firstname && styles.inputError]}
      />
      {errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        value={formData.lastname}
        onChangeText={(text) => setFormData({ ...formData, lastname: text })}
        style={[styles.input, errors.lastname && styles.inputError]}
      />
      {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        value={formData.email}
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />
      <Text style={styles.infoText}>Email address cannot be changed</Text>

      <View style={styles.buttonContainer}>
        <SaveButton loading={loading} onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#B00020",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginBottom: 8,
  },
  infoText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
