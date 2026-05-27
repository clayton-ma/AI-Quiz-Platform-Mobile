import React from "react";
import MainContainer from "../../../components/layout/MainContainer";
import UserSettingList from "../components/UserSetting";

/**
 * UserSettingListScreen component provides the layout for the settings tab.
 */
export default function UserSettingListScreen({ navigation }) {
  return (
    <MainContainer title="Settings" navigation={navigation} isMain={true}>
      <UserSettingList />
    </MainContainer>
  );
}
