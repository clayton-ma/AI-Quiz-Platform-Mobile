import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { BackgroundColor } from "../../../constants";

export default function CreateButton({ handlePress }) {
  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Icon name="add" color="#fff" size={30} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: BackgroundColor,
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
