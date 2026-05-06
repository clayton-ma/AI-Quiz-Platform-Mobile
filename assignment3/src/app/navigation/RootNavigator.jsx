import { useAuth } from "../providers/AuthContext";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

export function RootNavigator() {
  const user = true;

  return user ? <TabNavigator /> : <AuthNavigator />;
}
