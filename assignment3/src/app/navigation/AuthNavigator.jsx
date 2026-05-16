import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View } from "react-native";
import { Icon } from "react-native-elements";

import Login from "../../features/auth/screens/LoginScreen";
import Register from "../../features/auth/screens/RegisterScreen";

import { useTheme } from "../providers/ThemeContext";

import About from "../../features/about/screens/AboutScreen";

const AuthStack = createStackNavigator();
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

function LoginScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="LoginScreen" component={Login} />
    </AuthStack.Navigator>
  );
}

function RegisterScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="RegisterScreen" component={Register} />
    </AuthStack.Navigator>
  );
}

function AboutScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="AboutScreen" component={About} />
    </AuthStack.Navigator>
  );
}

// https://reactnavigation.org/docs/bottom-tab-navigator/
const Tab = createBottomTabNavigator();

export default function AuthNavigator() {
  const colors = useTheme();
  const tabScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.tabActiveColor,
    tabBarInactiveTintColor: colors.tabInactiveColor,
    tabBarIcon: ({ color, size }) => {
      return (
        <Icon
          name={
            route.name === "Login"
              ? "login"
              : route.name === "Register"
                ? "person-add"
                : "info"
          }
          type="material"
          size={size}
          color={color}
        />
      );
    },
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
