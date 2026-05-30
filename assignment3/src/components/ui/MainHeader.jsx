import React from "react";
import { Header, Icon } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

export default function MainHeader({ navigation, isMain, title }) {
  const { theme } = useTheme();

  if (isMain) {
    return (
      <Header
        containerStyle={{
          backgroundColor: theme.colors.primary,
        }}
        centerComponent={{
          text: title,
          style: { color: "#fff", fontWeight: "bold" },
        }}
      />
    );
  } else {
    return (
      <Header
        containerStyle={{
          backgroundColor: theme.colors.primary,
          borderBottomWidth: 0,
        }}
        leftComponent={{
          icon: "arrow-back",
          type: "material",
          color: "#fff",
          size: 30,
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: title,
          style: { color: "#fff", fontWeight: "bold" },
        }}
      />
    );
  }
}
