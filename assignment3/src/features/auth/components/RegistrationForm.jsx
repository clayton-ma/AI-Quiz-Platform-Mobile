/**
 * @file RegistrationForm.jsx
 * @description Component for user registration handling.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
} from "../../../utils/validationFunction";
import { registerUser } from "../services/authApi";
import ShowNotification from "../../../components/ui/ShowNotification";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import { useAuth } from "../../../app/providers/AuthContext";
import { useTheme } from "../../../app/providers/ThemeContext";
import Heading from "../../../components/ui/Heading";
import FormContainer from "../../../components/ui/FormContainer";

/**
 * RegisterForm component.
 *
 * Provides a comprehensive form for new users to create an account. It handles
 * input validation for names, emails, and passwords, ensures data consistency
 * (e.g., matching passwords), and manages the registration API lifecycle.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered registration form.
 */
export default function RegisterForm({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      confirm_email: "",
      password: "",
      confirm_password: "",
      agreeToTerms: false,
    },
  });

  const { user } = useAuth();

  /** Redirect user if they are already authenticated */
  useEffect(() => {
    if (user !== null) {
      ShowNotification({
        id: "login-success",
        title: "Welcome back",
        message: "You have successfully logged in.",
        type: "success",
      });

      navigation.navigate("QuizScreen");
    }
  }, [user]);

  /**
   * Handles the registration form submission.
   *
   * @param {Object} data - The validated form data.
   */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirm_email, confirm_password, agreeToTerms, ...apiData } =
        data;
      await registerUser(apiData);

      ShowNotification({
        id: "register-success",
        title: "Success",
        message: "Account created successfully. Please login.",
        type: "success",
      });

      navigation.navigate("Login");
    } catch (errors) {
      ShowErrorNotification(errors);
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
      <Heading
        title="Create an account"
        linkText="Already have an account?"
        linkActionText="Login"
        onLinkPress={() => navigation.navigate("Login")}
      />

      <FormContainer>
        <View style={styles.row}>
          <Controller
            control={control}
            name="firstname"
            rules={{
              required: "First name is required",
              validate: (v) => isValidName(v) || "Invalid first name",
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.flex1}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  First Name *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="Clayton"
                  placeholderTextColor={theme.dark ? "#666" : "#999"}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.firstname && (
                  <Text style={styles.error}>{errors.firstname.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="lastname"
            rules={{
              required: "Last name is required",
              validate: (v) => isValidName(v) || "Invalid last name",
            }}
            render={({ field: { onChange, value } }) => (
              <View style={[styles.flex1, { marginLeft: 10 }]}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Last Name *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="Ma"
                  placeholderTextColor={theme.dark ? "#666" : "#999"}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.lastname && (
                  <Text style={styles.error}>{errors.lastname.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            validate: (v) => isValidEmail(v) || "Invalid email address",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirm_email"
          rules={{
            required: "Please confirm your email",
            validate: (v) =>
              v === watch("email") || "Email addresses do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Confirm Email *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
              {errors.confirm_email && (
                <Text style={styles.error}>{errors.confirm_email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            validate: (v) =>
              isValidPassword(v) ||
              "Password must be at least 8 characters long and contain at least one letter and one number",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Password *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Your password"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirm_password"
          rules={{
            required: "Please confirm your password",
            validate: (v) =>
              v === watch("password") || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Confirm Password *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Your password"
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
              {errors.confirm_password && (
                <Text style={styles.error}>
                  {errors.confirm_password.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="agreeToTerms"
          rules={{ required: "You must agree to the terms and conditions" }}
          render={({ field: { onChange, value } }) => (
            <View>
              <View style={styles.checkboxContainer}>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#767577", true: theme.colors.primary }}
                />
                <Text
                  style={[styles.checkboxLabel, { color: theme.colors.text }]}
                >
                  I agree to the terms and conditions
                </Text>
              </View>
              {errors.agreeToTerms && (
                <Text style={styles.error}>{errors.agreeToTerms.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </FormContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  row: { flexDirection: "row", marginBottom: 15 },
  flex1: { flex: 1 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#495057" },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 5,
  },
  error: { color: "#fa5252", fontSize: 12, marginBottom: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  checkboxLabel: { marginLeft: 10, fontSize: 14, color: "#495057" },
  button: {
    backgroundColor: "#228be6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#a5d8ff" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
