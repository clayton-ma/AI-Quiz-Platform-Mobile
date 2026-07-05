/**
 * @file FormContainer.jsx
 * @description A reusable layout component that provides a consistent card-like container for forms.
 */
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * FormContainer component.
 *
 * Wraps children in a styled card with theme-aware background and border colors.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The form fields and buttons to display inside.
 */
export default function FormContainer({ children }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.formCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Base styling for the form card */
  formCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
