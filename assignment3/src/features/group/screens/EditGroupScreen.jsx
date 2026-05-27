import React from "react";
import { StyleSheet, View } from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import EditGroupForm from "../components/EditGroupForm";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * EditGroupScreen component serves as a wrapper for the EditGroupForm.
 * It provides the layout and navigation context for editing a group.
 */
export default function EditGroupScreen({ route, navigation }) {
  // Extract groupId from navigation parameters
  const { groupId } = route.params;
  const { theme } = useTheme();

  return (
    <MainContainer title="Edit Group" navigation={navigation} isMain={false}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <EditGroupForm groupId={groupId} navigation={navigation} />
      </View>
    </MainContainer>
  );
}
