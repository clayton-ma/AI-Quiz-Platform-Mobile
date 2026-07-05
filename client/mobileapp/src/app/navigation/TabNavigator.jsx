/**
 * @file TabNavigator.jsx
 * @description Defines the main navigation structure of the application, including bottom tabs and nested stack navigators.
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Icon } from "@rneui/themed";

import { useTheme } from "../providers/ThemeContext";
import UserProfileScreen from "../../features/user/screens/UserProfileScreen";
import ListGroup from "../../features/group/screens/ListGroupScreen";
import EditGroup from "../../features/group/screens/EditGroupScreen";

import About from "../../features/about/screens/AboutScreen";
import QuizList from "../../features/quiz/screens/ListQuizScreen";
import EditQuiz from "../../features/quiz/screens/EditQuizScreen";
import UserSettingList from "../../features/user/screens/UserSettingListScreen";
import CreateQuiz from "../../features/quiz/screens/CreateQuizScreen";
import ListAttempt from "../../features/attempt/screens/ListAttemptScreen";
import TakeAttempt from "../../features/attempt/screens/TakeAttemptScreen";
import ViewAttempt from "../../features/attempt/screens/ViewAttemptScreen";

const RootStack = createStackNavigator();
const QuizStack = createStackNavigator();
const GroupStack = createStackNavigator();
const UserStack = createStackNavigator();
const AttemptStack = createStackNavigator();

/** Default options for stack navigators to maintain a clean UI */
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

/**
 * QuizStack component.
 * Manages navigation between quiz listing, editing, and creation.
 */
function QuizStackScreen() {
  return (
    <QuizStack.Navigator screenOptions={stackScreenOptions}>
      <QuizStack.Screen name="QuizList" component={QuizList} />
      <QuizStack.Screen name="EditQuiz" component={EditQuiz} />
      <QuizStack.Screen name="CreateQuiz" component={CreateQuiz} />
    </QuizStack.Navigator>
  );
}

/**
 * GroupStack component.
 * Manages navigation between group listing and group management.
 */
function GroupStackScreen() {
  return (
    <GroupStack.Navigator screenOptions={stackScreenOptions}>
      <GroupStack.Screen name="GroupList" component={ListGroup} />
      <GroupStack.Screen name="EditGroup" component={EditGroup} />
    </GroupStack.Navigator>
  );
}

/**
 * UserStack component.
 * Manages navigation for user settings, profile editing, and app information.
 */
function UserStackScreen() {
  return (
    <UserStack.Navigator screenOptions={stackScreenOptions}>
      <UserStack.Screen name="UserSettingList" component={UserSettingList} />
      <UserStack.Screen name="UserProfile" component={UserProfileScreen} />
      <UserStack.Screen name="About" component={About} />
    </UserStack.Navigator>
  );
}

/**
 * AttemptStack component.
 * Manages the workflow for viewing, taking, and reviewing quiz attempts.
 */
function AttemptScreen() {
  return (
    <AttemptStack.Navigator screenOptions={stackScreenOptions}>
      <AttemptStack.Screen name="ListAttempt" component={ListAttempt} />
      <AttemptStack.Screen name="TakeAttempt" component={TakeAttempt} />
      <AttemptStack.Screen name="ViewAttempt" component={ViewAttempt} />
    </AttemptStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

/** Mapping of route names to Material Icon names */
const TAB_ICONS = {
  Quiz: "quiz",
  Group: "group",
  User: "person",
};

/**
 * MainTabs component.
 * Implements the bottom tab navigation bar with theme-aware styling.
 * @returns {JSX.Element} The bottom tab navigator.
 */
function MainTabs() {
  const { theme } = useTheme();
  const tabScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.tabActiveColor,
    tabBarInactiveTintColor: theme.colors.tabInactiveColor,
    tabBarStyle: {
      backgroundColor: theme.colors.tabBarBackground,
      borderTopColor: theme.colors.tabBarBorder,
    },
    tabBarIcon: ({ color, size }) => (
      <Icon
        name={TAB_ICONS[route.name] || "info"}
        type="material"
        size={size}
        color={color}
      />
    ),
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Quiz" component={QuizStackScreen} />
      <Tab.Screen name="Group" component={GroupStackScreen} />
      <Tab.Screen name="User" component={UserStackScreen} />
    </Tab.Navigator>
  );
}

/**
 * TabNavigator component.
 * The primary navigator for authenticated users, wrapping tabs and the attempt flow.
 * @returns {JSX.Element} The root stack for authenticated users.
 */
export default function TabNavigator() {
  return (
    <RootStack.Navigator screenOptions={stackScreenOptions}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="Attempt" component={AttemptScreen} />
    </RootStack.Navigator>
  );
}
