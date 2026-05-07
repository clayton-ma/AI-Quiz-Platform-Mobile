import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Group from "../components/Group";
import { useTheme } from "../../../app/providers/ThemeContext";

const groups = [
  { id: "1", name: "React Native Developers", memberCount: 120, isAdmin: true },
  { id: "2", name: "UI/UX Enthusiasts", memberCount: 85, isAdmin: false },
  { id: "3", name: "AI Quiz Masters", memberCount: 45, isAdmin: true },
];

export default function ListGroupScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <Group
            name={item.name}
            memberCount={item.memberCount}
            isAdmin={item.isAdmin}
            onActionPress={() => console.log(`Managing ${item.name}`)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
