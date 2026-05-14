import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View } from "react-native";

import UserProfile from "../../features/user/screens/UserProfileScreen";
import ListGroup from "../../features/group/screens/ListGroupScreen";
import EditGroup from "../../features/group/screens/EditGroupScreen";

import moveTabIcon from "../../assets/move-active.png";
import pokemonTabIcon from "../../assets/pokemon-active.png";
import About from "../../features/about/screens/AboutScreen";
import QuizList from "../../features/quiz/screens/ListQuizScreen";
import EditQuiz from "../../features/quiz/screens/EditQuizScreen";

// https://reactnavigation.org/docs/stack-navigator/
const QuizStack = createStackNavigator();
const GroupStack = createStackNavigator();
const UserStack = createStackNavigator();
const AboutStack = createStackNavigator();
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

function QuizScreen() {
  return (
    <QuizStack.Navigator screenOptions={stackScreenOptions}>
      <QuizStack.Screen name="QuizList" component={QuizList} />
      <QuizStack.Screen name="EditQuiz" component={EditQuiz} />
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
      <UserStack.Screen name="UserProfile" component={UserProfile} />
    </UserStack.Navigator>
  );
}

function AboutScreen() {
  return (
    <AboutStack.Navigator screenOptions={stackScreenOptions}>
      <AboutStack.Screen name="AboutScreen" component={About} />
    </AboutStack.Navigator>
  );
}

// https://reactnavigation.org/docs/bottom-tab-navigator/
const Tab = createBottomTabNavigator();
const ActiveColor = "#000000";
const InActiveColor = "#00000077";
const tabScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: ActiveColor,
  tabBarInactiveTintColor: InActiveColor,
  tabBarIcon: ({ color, size }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={route.name === "Quiz" ? pokemonTabIcon : moveTabIcon}
          style={{
            opacity: color === ActiveColor ? 1 : 0.5,
            width: size,
            height: size,
          }}
        />
      </View>
    );
  },
});

export default function Navigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name="Quiz" component={QuizScreen} />
        <Tab.Screen name="Group" component={GroupScreen} />
        <Tab.Screen name="User" component={UserScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
