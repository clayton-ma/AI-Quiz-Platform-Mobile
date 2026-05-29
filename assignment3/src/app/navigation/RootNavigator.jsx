import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useAuth } from "../providers/AuthContext";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

const prefix = Linking.createURL("/");
const universal = "https://barossa02.ifn666.com"; // Handles your web domain

export function RootNavigator() {
  const { user } = useAuth();
  const linking = {
    prefixes: [prefix, universal],
    config: {
      screens: {
        // Auth routes
        Login: "login",
        Register: "register",
        About: "about",

        // App routes (when authenticated)
        // The structure matches TabNavigator
        MainTabs: {
          screens: {
            Quiz: {
              screens: {
                QuizList: "quiz",
                EditQuiz: "quiz/edit/:id",
                CreateQuiz: "quiz/create",
              },
            },
            Group: {
              screens: {
                GroupList: "group",
                EditGroup: "group/edit/:id",
              },
            },
            User: {
              screens: {
                UserSettingList: "user/settings",
                UserProfile: "user/profile",
                About: "user/about",
              },
            },
          },
        },
        Attempt: {
          screens: {
            ListAttempt: "attempt",
            TakeAttempt: "attempt/take/:id",
            ViewAttempt: "attempt/view/:id",
          },
        },
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
