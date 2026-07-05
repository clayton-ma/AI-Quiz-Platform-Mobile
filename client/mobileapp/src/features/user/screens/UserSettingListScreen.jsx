import React from "react";
import MainContainer from "../../../components/layout/MainContainer";
import UserSettingList from "../components/UserSetting";

/**
 * UserSettingListScreen
 *
 * A screen component that serves as the primary entry point for the Settings tab.
 * It wraps the UserSettingList component within a MainContainer to provide
 * consistent layout and navigation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered settings screen
 */
export default function UserSettingListScreen({ navigation }) {
  return (
    <MainContainer title="Settings" navigation={navigation} isMain={true}>
      <UserSettingList />
    </MainContainer>
  );
}
