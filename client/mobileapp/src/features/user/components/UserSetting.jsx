import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Icon, Divider } from "@rneui/themed";
import { useAuth } from "../../../app/providers/AuthContext";
import { useTheme } from "../../../app/providers/ThemeContext";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useNavigation } from "@react-navigation/native";
import SettingListItem from "./SettingListItem";

/**
 * UserSettingList component.
 *
 * Displays the user's profile summary and a list of settings including
 * profile editing, app information, theme toggling, and logout functionality.
 *
 * @returns {JSX.Element} The rendered settings list.
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

  /**
   * Prompts the user for logout confirmation and clears user session.
   */
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
      {/* User Profile Header */}
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

      <View style={styles.listContainer}>
        {settingsOptions.map((item) => (
          <SettingListItem key={`setting-${item.key}`} item={item} />
        ))}

        {/* Theme Toggle */}
        <View
          style={[
            styles.settingRow,
            {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.leftContent}>
            <Icon name="brightness-medium" color={theme.colors.primary} />

            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              Dark Mode
            </Text>
          </View>

          <Switch
            value={theme.dark}
            onValueChange={() => updateThemeMode(theme.dark ? "light" : "dark")}
            trackColor={{
              false: "#ddd",
              true: theme.colors.primary,
            }}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.settingRow,
            styles.logoutButton,
            {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.leftContent}>
            <Icon name="logout" color="#fa5252" />

            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
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
  settingRow: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#fa5252",
  },
});
