/**
 * @file LoginScreen.jsx
 * @description Screen component for the user login interface.
 */
import MainContainer from "../../../components/layout/MainContainer";
import LoginForm from "../components/LoginForm";
import { useNavigation } from "@react-navigation/native";

/**
 * LoginScreen
 *
 * A screen component that provides the layout for the login process.
 * It wraps the LoginForm within a MainContainer to maintain consistent
 * branding and layout.
 *
 * @returns {JSX.Element} The rendered login screen.
 */
export default function LoginScreen() {
  const navigation = useNavigation();
  return (
    <MainContainer title="Login" navigation={navigation} isMain={true}>
      <LoginForm navigation={navigation} />
    </MainContainer>
  );
}
