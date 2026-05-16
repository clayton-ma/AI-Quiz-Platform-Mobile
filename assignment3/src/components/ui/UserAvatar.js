import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import { BackgroundColor } from "../../constants";

const BackgroundColor="white"

/**
 * UserAvatar component displays the user's initials in a circular container.
 * 
 * @param {string} firstname - User's first name.
 * @param {string} lastname - User's last name.
 * @param {number} size - Diameter of the avatar.
 */
export default function UserAvatar({ firstname, lastname, size = 50 }) {
  const getInitials = () => {
    const f = firstname ? firstname.charAt(0).toUpperCase() : "";
    const l = lastname ? lastname.charAt(0).toUpperCase() : "";
    return `${f}${l}` || "?";
  };

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: BackgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.4,
          },
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  initials: {
    color: "#fff",
    fontWeight: "bold",
  },
});