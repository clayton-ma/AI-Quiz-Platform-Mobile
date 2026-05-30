import { View, StyleSheet } from "react-native";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * A reusable container for authentication forms.
 * Provides consistent styling for the card-like background and borders.
 *
 * @param {React.ReactNode} children - The form fields and buttons to display inside.
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
  formCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#fff",
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
