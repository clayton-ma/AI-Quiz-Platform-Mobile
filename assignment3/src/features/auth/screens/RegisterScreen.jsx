import MainContainer from "../../../components/layout/MainContainer";
import { useNavigation } from "@react-navigation/native";
import RegisterForm from "../components/RegistrationForm";

export default function RegisterScreen() {
  const navigation = useNavigation();
  return (
    <MainContainer title="Register" navigation={navigation} isMain={true}>
      <RegisterForm navigation={navigation} />
    </MainContainer>
  );
}
