import MainContainer from "../../../components/layout/MainContainer";
import LoginForm from "../components/LoginForm";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  return (
    <MainContainer title="Login" navigation={navigation} isMain={true}>
      <LoginForm navigation={navigation} />
    </MainContainer>
  );
}
