import React from "react";
import MainContainer from "../../../components/layout/MainContainer";
import UserProfileForm from "../components/UserProfileForm";

/**
 * UserProfileScreen
 *
 * A screen component that provides the layout for viewing and editing the user's profile.
 * It wraps the UserProfileForm within a MainContainer to maintain consistent styling
 * and provide back navigation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered user profile screen
 */
export default function UserProfileScreen({ navigation }) {
  return (
    <MainContainer title="User Profile" navigation={navigation} isMain={false}>
      <UserProfileForm />
    </MainContainer>
  );
}
