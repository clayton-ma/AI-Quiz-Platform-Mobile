/**
 * @file LoginForm.jsx
 * @description Component for user authentication and login handling.
 */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import {
  isValidEmail,
  isValidPassword,
} from "../../../utils/validationFunction";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../services/authApi";
import ShowNotification from "../../../components/ui/ShowNotification";
import { useAuth } from "../../../app/providers/AuthContext";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import { useTheme } from "../../../app/providers/ThemeContext";
import Heading from "../../../components/ui/Heading";
import FormContainer from "../../../components/ui/FormContainer";

/**
 * LoginForm component.
 *
 * Provides a form for existing users to authenticate. It handles input validation,
 * backend API interaction, and automatic redirection upon successful login.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered login form.
 */
export default function LoginForm({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
   * Handles the login form submission to the backend.
   *
   * @param {Object} data - The validated form data (email and password).
   */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginUser(data);
      await refreshUser();
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
        title="Login"
        linkText="Don't have an account?"
        linkActionText="Create account"
        onLinkPress={() => navigation.navigate("Register")}
      />

      <FormContainer>
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            validate: (value) => isValidEmail(value) || "Invalid email address",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </View>
          )}
          name="password"
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
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>
      </FormContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
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
  button: {
    backgroundColor: "#228be6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: "#a5d8ff" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
