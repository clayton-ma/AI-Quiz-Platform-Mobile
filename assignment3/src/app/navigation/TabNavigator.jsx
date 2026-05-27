import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Icon } from "react-native-elements";

import { useAuth } from "../providers/AuthContext";
import { useTheme } from "../providers/ThemeContext";
import UserProfile from "../../features/user/screens/UserProfileScreen";
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

const QuizStack = createStackNavigator();
const GroupStack = createStackNavigator();
const UserStack = createStackNavigator();
const AttemptStack = createStackNavigator();
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

function QuizScreen() {
  return (
    <QuizStack.Navigator screenOptions={stackScreenOptions}>
      <QuizStack.Screen name="QuizList" component={QuizList} />
      <QuizStack.Screen name="EditQuiz" component={EditQuiz} />
      <QuizStack.Screen name="CreateQuiz" component={CreateQuiz} />
    </QuizStack.Navigator>
  );
}

function GroupScreen() {
  return (
    <GroupStack.Navigator screenOptions={stackScreenOptions}>
      <GroupStack.Screen name="GroupList" component={ListGroup} />
      <GroupStack.Screen name="EditGroup" component={EditGroup} />
    </GroupStack.Navigator>
  );
}

function UserScreen() {
  return (
    <UserStack.Navigator screenOptions={stackScreenOptions}>
      <UserStack.Screen name="UserSettingList" component={UserSettingList} />
      <UserStack.Screen name="UserProfile" component={UserProfile} />
      <UserStack.Screen name="About" component={About} />
    </UserStack.Navigator>
  );
}

// https://reactnavigation.org/docs/bottom-tab-navigator/
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Quiz: "quiz",
  Group: "group",
  User: "person",
};

export default function TabNavigator() {
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
    <NavigationContainer>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        {/* <Tab.Screen name="Quiz" component={QuizScreen} /> */}
        {/* <Tab.Screen name="Group" component={GroupScreen} /> */}
        <Tab.Screen name="User" component={UserScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
