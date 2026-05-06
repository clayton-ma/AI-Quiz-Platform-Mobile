import * as React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import About from "../../features/about/screens/AboutScreen";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import RegisterScreen from "../../features/auth/screens/RegisterScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AuthNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="Auth"
        options={{ title: "Login / Register" }}
        component={AuthStack}
      />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
}
