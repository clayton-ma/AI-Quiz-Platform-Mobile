import MainContainer from "../../../components/layout/MainContainer";
import UserProfileForm from "../components/UserProfileForm";
import UserSettingList from "../components/UserSetting";

/**
 * UserProfileScreen component provides the layout for viewing and editing user profile.
 */
export default function UserProfileScreen({ navigation }) {
  return (
    <MainContainer title="User Profile" navigation={navigation} isMain={true}>
      <UserProfileForm />
    </MainContainer>
  );
}
