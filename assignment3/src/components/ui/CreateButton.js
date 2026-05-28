import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../app/providers/ThemeContext";

export default function CreateButton({ handlePress }) {
  const { theme } = useTheme();
  const BackgroundColor = theme.colors.primary;

  return (
    <TouchableOpacity style={[styles.fab, { backgroundColor: BackgroundColor }]} onPress={handlePress}>
      <Icon name="add" color="#fff" size={30} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
