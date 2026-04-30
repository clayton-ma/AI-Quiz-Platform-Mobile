import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import MainHeader from "../../assignment3/components/MainHeader";
import { BackgroundColor } from "../constants";

export default function UserDetail({ navigation, route }) {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email,setEmail]=useState("john.doe@example.com");

  const handleSave = () => {
    Alert.alert("Success", "User information updated!");
  };

  return (
    <View style={styles.container}>
      <MainHeader navigation={navigation} title="User Profile" />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Read Only)</Text>
            <Text style={styles.readOnlyText}>{email}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    minHeight: 480,
    marginVertical: 30,
    marginHorizontal: 15,
  },
 inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#1a87d9",
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  readOnlyText: {
    fontSize: 16,
    color: "#666",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: BackgroundColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  moveType: {
    alignItems: "center",
  },
  description: {
    color: "#4f4f4f",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 35,
  },
  moveCompare: {
    flexDirection: "row",
  },
  movePart: {
    flex: 1,
    alignItems: "center",
    borderRightColor: "#f0f0f0",
    borderRightWidth: 1,
  },
  borderRightNone: {
    borderRightWidth: 0,
  },
  movePartTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: "#1a87d9",
    fontWeight: "bold",
  },
  hr: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
});
