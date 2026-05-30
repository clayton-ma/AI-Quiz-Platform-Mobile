import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from "react-native";
import { ListItem, Icon, Divider } from "react-native-elements";
import { useAuth } from "../../../app/providers/AuthContext";
import { useTheme } from "../../../app/providers/ThemeContext";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useNavigation } from "@react-navigation/native";
import SettingListItem from "./SettingListItem";

/**
 * UserSettingList component displays a list of user settings and actions.
 * Includes user profile summary, edit profile, about app, and logout.
 */
export default function UserSettingList() {
  const { user, clearUser } = useAuth();
  const { theme, updateThemeMode } = useTheme();
  const navigation = useNavigation();

  const settingsOptions = [
    {
      title: "Edit Profile",
      icon: "person-outline",
      key: "edit-profile",
      onPress: () => navigation.navigate("UserProfile"),
    },
    {
      title: "About This App",
      icon: "info-outline",
      key: "about",
      onPress: () => navigation.navigate("About"),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => await clearUser(),
      },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {/* User Profile Header Section */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <UserAvatar
          firstname={user?.firstname}
          lastname={user?.lastname}
          size={80}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user ? `${user.firstname} ${user.lastname}` : "Guest User"}
          </Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>
      </View>

      <Divider style={{ backgroundColor: theme.colors.border }} />

      {/* Settings Options */}
      <View style={styles.listContainer}>
        {settingsOptions.map((item) => (
          <SettingListItem key={`setting-${item.key}`} item={item} />
        ))}

        {/* Theme Toggle Button */}
        <ListItem
          key="toggle-theme"
          containerStyle={{
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          }}
          bottomDivider
        >
          <Icon key="icon" name="brightness-medium" color={theme.colors.primary} />
          <ListItem.Content key="content">
            <ListItem.Title style={{ color: theme.colors.text }}>
              Dark Mode
            </ListItem.Title>
          </ListItem.Content>
          <Switch
            key="switch"
            value={theme.dark}
            onValueChange={() => updateThemeMode(theme.dark ? "light" : "dark")}
            trackColor={{ false: "#ddd", true: theme.colors.primary }}
          />
        </ListItem>

        {/* Logout Button */}
        <ListItem
          onPress={handleLogout}
          key="logout"
          containerStyle={[
            styles.logoutButton,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Icon key="icon" name="logout" color="#fa5252" />
          <ListItem.Content key="content">
            <ListItem.Title style={{ color: "#fa5252", fontWeight: "600" }}>
              Logout
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    marginTop: 15,
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#868e96",
    marginTop: 4,
  },
  listContainer: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
});
