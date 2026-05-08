import React from "react";
import MainContainer from "../../../components/layout/MainContainer";
import EditGroupForm from "../components/EditGroupForm";

/**
 * EditGroupScreen component serves as a wrapper for the EditGroupForm.
 * It provides the layout and navigation context for editing a group.
 */
export default function EditGroupScreen({ route, navigation }) {
  // Extract groupId from navigation parameters
  const { groupId } = route.params;

  return (
    <MainContainer title="Edit Group" navigation={navigation} isMain={false}>
      <EditGroupForm groupId={groupId} navigation={navigation} />
    </MainContainer>
  );
}
