import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ListItem, Icon, Divider } from "react-native-elements";
import { useAuth } from "../../../app/providers/AuthContext";
import { useTheme } from "../../../app/providers/ThemeContext";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useNavigation } from "@react-navigation/native";

/**
 * UserSettingList component displays a list of user settings and actions.
 * Includes user profile summary, edit profile, about app, and logout.
 */
export default function UserSettingList() {
  const { user, clearUser } = useAuth();
  const { theme } = useTheme();
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

  const handleLogout = async () => {
    await clearUser();
    // Navigation to Login is usually handled by the Auth stack listener
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

      <Divider />

      {/* Settings Options */}
      <View style={styles.listContainer}>
        {settingsOptions.map((item) => (
          <ListItem
            key={`setting-${item.key}`}
            onPress={item.onPress}
            containerStyle={{ backgroundColor: theme.colors.background }}
            bottomDivider
          >
            <Icon name={item.icon} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title style={{ color: theme.colors.text }}>
                {item.title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}

        {/* Logout Button */}
        <ListItem
          onPress={handleLogout}
          key="logout"
          containerStyle={[
            styles.logoutButton,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Icon name="logout" color="#fa5252" />
          <ListItem.Content>
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
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
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
