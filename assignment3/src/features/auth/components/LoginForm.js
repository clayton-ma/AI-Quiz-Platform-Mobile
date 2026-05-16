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
 * Login component provides a form for existing users to authenticate.
 * It handles validation, API interaction, and redirects authenticated users.
 * Adapted for React Native.
 */
export default function LoginForm({ navigation }) {
  // Access authentication context to check user status and refresh data
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
   * Handles the login form submission.
   */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Attempt to authenticate with the backend
      await loginUser(data);

      // Update the global AuthContext with the new user data
      await refreshUser();
    } catch (errors) {
      // Display backend or network errors to the user
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  linkText: { textAlign: "center", marginTop: 10, color: "#666" },
  link: { color: "#228be6", fontWeight: "600" },
  formCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#fff",
    elevation: 2,
  },
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
