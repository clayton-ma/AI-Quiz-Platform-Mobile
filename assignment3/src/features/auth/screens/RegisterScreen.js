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

/**
 * Register component provides a form for new users to create an account.
 * Adapted for React Native.
 */
export default function Register({ navigation }) {
  const [loading, setLoading] = useState(false); // Local state for submission loading
  const { theme } = useTheme();

  // Access authentication context to check if user is already logged in
  const { user } = useAuth();

  useEffect(() => {
    if (user !== null) {
      ShowNotification({
        id: "login-success",
        title: "Welcome back",
        message: "You have successfully logged in.",
        type: "success",
      });

      navigation.navigate("Quiz");
    }
  }, [user]);

  // Local state for form management
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_email: "",
    confirm_password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!isValidName(values.firstname))
      newErrors.firstname = "Invalid first name";
    if (!isValidName(values.lastname)) newErrors.lastname = "Invalid last name";
    if (!isValidEmail(values.email)) newErrors.email = "Invalid email address";
    if (!isValidPassword(values.password))
      newErrors.password =
        "Password must be at least 8 characters long and contain at least one letter and one number";
    if (values.confirm_email !== values.email)
      newErrors.confirm_email = "Email addresses do not match";
    if (values.confirm_password !== values.password)
      newErrors.confirm_password = "Passwords do not match";
    if (!values.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setFieldValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  /**
   * Handles the registration form submission.
   */
  const handleRegister = async () => {
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const { confirm_email, confirm_password, agreeToTerms, ...apiData } =
        values;
      await registerUser(apiData);

      ShowNotification({
        id: "register-success",
        title: "Success",
        message: "Account created successfully. Please login.",
        type: "success",
      });

      // Redirect to login so user can authenticate with new credentials
      navigation.navigate("Login");
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
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Create an account
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            Login
          </Text>
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              First Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
              placeholder="Clayton"
              placeholderTextColor={theme.dark ? "#666" : "#999"}
              onChangeText={(val) => setFieldValue("firstname", val)}
              value={values.firstname}
            />
            {errors.firstname && (
              <Text style={styles.error}>{errors.firstname}</Text>
            )}
          </View>
          <View style={[styles.flex1, { marginLeft: 10 }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Last Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border },
              ]}
              placeholder="Ma"
              placeholderTextColor={theme.dark ? "#666" : "#999"}
              onChangeText={(val) => setFieldValue("lastname", val)}
              value={values.lastname}
            />
            {errors.lastname && (
              <Text style={styles.error}>{errors.lastname}</Text>
            )}
          </View>
        </View>

        {["email", "confirm_email", "password", "confirm_password"].map(
          (field) => (
            <View key={field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                {field
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder={
                  field.includes("email") ? "you@example.com" : "Your password"
                }
                placeholderTextColor={theme.dark ? "#666" : "#999"}
                keyboardType={
                  field.includes("email") ? "email-address" : "default"
                }
                autoCapitalize="none"
                secureTextEntry={field.includes("password")}
                onChangeText={(val) => setFieldValue(field, val)}
                value={values[field]}
              />
              {errors[field] && (
                <Text style={styles.error}>{errors[field]}</Text>
              )}
            </View>
          ),
        )}

        <View style={styles.checkboxContainer}>
          <Switch
            value={values.agreeToTerms}
            onValueChange={(val) => setFieldValue("agreeToTerms", val)}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
          />
          <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>
            I agree to the terms and conditions
          </Text>
        </View>
        {errors.agreeToTerms && (
          <Text style={styles.error}>{errors.agreeToTerms}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
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
