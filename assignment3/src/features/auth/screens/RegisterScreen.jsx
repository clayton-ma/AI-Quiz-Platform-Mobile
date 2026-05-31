/**
 * @file RegisterScreen.jsx
 * @description Screen component for the user registration interface.
 */
import MainContainer from "../../../components/layout/MainContainer";
import { useNavigation } from "@react-navigation/native";
import RegisterForm from "../components/RegistrationForm";

/**
 * RegisterScreen
 *
 * A screen component that provides the layout for the user registration process.
 * It wraps the RegisterForm within a MainContainer to maintain consistent
 * branding and layout across the authentication flow.
 *
 * @returns {JSX.Element} The rendered registration screen.
 */
export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <MainContainer title="Register" navigation={navigation} isMain={true}>
      <RegisterForm navigation={navigation} />
    </MainContainer>
  );
}
