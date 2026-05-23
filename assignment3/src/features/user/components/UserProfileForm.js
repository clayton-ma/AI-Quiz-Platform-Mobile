import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import UserAvatar from "../../../components/ui/UserAvatar";
import { isValidName } from "../../../utils/validationFunction";
import { SaveButton } from "../../../components/ui/Button";
import { useAuth } from "../../../app/providers/AuthContext";
import { updateUser } from "../services/userApi";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../app/providers/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FormContainer from "../../../components/ui/FormContainer";

/**
 * ProfileForm component allows users to view and update their personal information.
 * It handles name updates and provides a link to the password change page.
 */
export default function UserProfileForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData) => {
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.avatarContainer}>
        <UserAvatar
          firstname={user?.firstname}
          lastname={user?.lastname}
          size={100}
        />
      </View>
      <FormContainer>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          First Name
        </Text>
        <Controller
          control={control}
          name="firstname"
          rules={{
            required: "First name is required",
            validate: (v) => isValidName(v) || "Invalid first name",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                },
                errors.firstname && styles.inputError,
              ]}
              placeholderTextColor={theme.dark ? "#666" : "#999"}
            />
          )}
        />
        {errors.firstname && (
          <Text style={styles.errorText}>{errors.firstname.message}</Text>
        )}

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Last Name
        </Text>
        <Controller
          control={control}
          name="lastname"
          rules={{
            required: "Last name is required",
            validate: (v) => isValidName(v) || "Invalid last name",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                },
                errors.lastname && styles.inputError,
              ]}
              placeholderTextColor={theme.dark ? "#666" : "#999"}
            />
          )}
        />
        {errors.lastname && (
          <Text style={styles.errorText}>{errors.lastname.message}</Text>
        )}

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Email Address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <TextInput
              value={value}
              editable={false}
              style={[
                styles.input,
                {
                  color: theme.dark ? "#888" : "#666",
                  borderColor: theme.colors.border,
                  backgroundColor: theme.dark ? "#2c2e33" : "#f0f0f0",
                },
                styles.disabledInput,
              ]}
            />
          )}
        />
        <Text style={styles.infoText}>Email address cannot be changed</Text>

        <View style={styles.buttonContainer}>
          <SaveButton loading={loading} onPress={handleSubmit(onSubmit)} />
        </View>
      </FormContainer>
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
