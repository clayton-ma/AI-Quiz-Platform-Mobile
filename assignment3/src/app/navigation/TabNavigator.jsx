import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View } from "react-native";

import MoveDetail from "../../screens/MoveDetail";
import MoveList from "../../screens/MoveList";
import UserDetail from "../../screens/UserDetail";
import PokemonDetail from "../../screens/PokemonDetail";
import PokemonList from "../../screens/PokemonList";
import ListGroup from "../../features/group/screens/ListGroupScreen";
import EditGroup from "../../features/group/screens/EditGroupScreen";

import moveTabIcon from "../../assets/move-active.png";
import pokemonTabIcon from "../../assets/pokemon-active.png";
import About from "../../features/about/screens/AboutScreen";
import QuizList from "../../features/quiz/screen";

// https://reactnavigation.org/docs/stack-navigator/
const PokemonStack = createStackNavigator();
const MoveStack = createStackNavigator();
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

function QuizScreen() {
  return (
    <PokemonStack.Navigator screenOptions={stackScreenOptions}>
      <PokemonStack.Screen name="QuizList" component={QuizList} />
    </PokemonStack.Navigator>
  );
}

function GroupScreen() {
  return (
    <MoveStack.Navigator screenOptions={stackScreenOptions}>
      <MoveStack.Screen name="GroupList" component={ListGroup} />
      <MoveStack.Screen name="EditGroup" component={EditGroup} />
    </MoveStack.Navigator>
  );
}

function UserScreen() {
  return (
    <MoveStack.Navigator screenOptions={stackScreenOptions}>
      <MoveStack.Screen name="MoveList" component={UserDetail} />
    </MoveStack.Navigator>
  );
}

function AboutScreen() {
  return (
    <MoveStack.Navigator screenOptions={stackScreenOptions}>
      <MoveStack.Screen name="AboutScreen" component={About} />
    </MoveStack.Navigator>
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
          source={route.name === "Pokemons" ? pokemonTabIcon : moveTabIcon}
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
