/**
 * @file AuthNavigator.jsx
 * @description Defines the navigation structure for unauthenticated users, including Login, Register, and About tabs.
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Icon } from "@rneui/themed";

import Login from "../../features/auth/screens/LoginScreen";
import Register from "../../features/auth/screens/RegisterScreen";

import { useTheme } from "../providers/ThemeContext";

import About from "../../features/about/screens/AboutScreen";

const AuthStack = createStackNavigator();

/** Default options for stack navigators to maintain a clean UI */
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

/**
 * LoginStack component.
 * Wraps the Login screen in a stack navigator.
 *
 * @returns {JSX.Element}
 */
function LoginScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="LoginScreen" component={Login} />
    </AuthStack.Navigator>
  );
}

/**
 * RegisterStack component.
 * Wraps the Register screen in a stack navigator.
 *
 * @returns {JSX.Element}
 */
function RegisterScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="RegisterScreen" component={Register} />
    </AuthStack.Navigator>
  );
}

/**
 * AboutStack component.
 * Wraps the About screen in a stack navigator.
 *
 * @returns {JSX.Element}
 */
function AboutScreen() {
  return (
    <AuthStack.Navigator screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="AboutScreen" component={About} />
    </AuthStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

/** Mapping of route names to Material Icon names */
const TAB_ICONS = {
  Login: "login",
  Register: "person-add",
  About: "psychology",
};

/**
 * AuthNavigator component provides the navigation structure for unauthenticated users.
 * It includes a bottom tab navigator for About, Login, and Register screens.
 *
 * @returns {JSX.Element} The authentication navigation container.
 */
export default function AuthNavigator() {
  const { theme } = useTheme();
  const tabScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.tabActiveColor,
    tabBarInactiveTintColor: theme.colors.tabInactiveColor,
    tabBarStyle: {
      backgroundColor: theme.colors.tabBarBackground,
      borderTopColor: theme.colors.tabBarBorder,
    },
    tabBarIcon: ({ color, size }) => {
      return (
        <Icon
          name={TAB_ICONS[route.name] || "help-outline"}
          type="material"
          size={size}
          color={color}
        />
      );
    },
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
  );
}
