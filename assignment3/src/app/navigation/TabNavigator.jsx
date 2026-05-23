import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { Icon, Text } from "react-native-elements";

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

// https://reactnavigation.org/docs/stack-navigator/
const QuizStack = createStackNavigator();
const GroupStack = createStackNavigator();
const UserStack = createStackNavigator();
const AboutStack = createStackNavigator();
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

function AttemptScreen() {
  return (
    <AttemptStack.Navigator screenOptions={stackScreenOptions}>
      <AttemptStack.Screen name="ListAttempt" component={ListAttempt} />
      <AttemptStack.Screen name="TakeAttempt" component={TakeAttempt} />
      <AttemptStack.Screen name="ViewAttempt" component={ViewAttempt} />
    </AttemptStack.Navigator>
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

export default function TabNavigator() {
  const colors = useTheme();
  const tabScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.tabActiveColor,
    tabBarInactiveTintColor: colors.tabInactiveColor,
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === "Quiz") {
        iconName = "quiz";
      } else if (route.name === "Group") {
        iconName = "group";
      } else if (route.name === "User") {
        iconName = "person";
      } else {
        iconName = "info";
      }

      return <Icon name={iconName} type="material" size={size} color={color} />;
    },
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="Group" component={GroupScreen} />
        <Tab.Screen name="User" component={UserScreen} />
        <Tab.Screen name="Attempt" component={AttemptScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
