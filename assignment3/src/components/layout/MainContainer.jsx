import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import MainHeader from "../ui/MainHeader";
import { useAuth } from "../../app/providers/AuthContext";

export default function MainContainer({
  children,
  title,
  navigation,
  isMain = true,
}) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <MainHeader
        title={title || "Available Quizzes"}
        isMain={isMain}
        navigation={navigation}
      />
      {isMain && (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="logout" type="material" color="#000" size={24} />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 15,
  },
  searchInput: {
    backgroundColor: "#e9e9e9",
  },
  listContent: {
    paddingBottom: 80,
  },
  quizTitle: {
    fontWeight: "bold",
    color: "#2C3E50",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
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
