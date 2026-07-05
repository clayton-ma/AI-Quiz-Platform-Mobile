/**
 * @file EditGroupScreen.jsx
 * @description Screen component for editing an existing group's details.
 */
import React from "react";
import { View } from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import EditGroupForm from "../components/EditGroupForm";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * EditGroupScreen
 *
 * This screen serves as the entry point for modifying group information.
 * It extracts the groupId from navigation parameters and passes it to the EditGroupForm.
 *
 * @param {Object} props - Component props
 * @param {Object} props.route - React Navigation route object containing params
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered Edit Group screen.
 */
export default function EditGroupScreen({ route, navigation }) {
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
