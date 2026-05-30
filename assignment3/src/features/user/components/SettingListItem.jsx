import React from "react";
import { ListItem, Icon } from "react-native-elements";
import { useTheme } from "../../../app/providers/ThemeContext";

export default function SettingListItem({ item }) {
  const { theme } = useTheme();
  return (
    <ListItem
      key={`setting-${item.key}`}
      onPress={item.onPress}
      containerStyle={{
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border,
      }}
      bottomDivider
    >
      <Icon key="icon" name={item.icon} color={theme.colors.primary} />
      <ListItem.Content key="content">
        <ListItem.Title style={{ color: theme.colors.text }}>
          {item.title}
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron key="chevron" />
    </ListItem>
  );
}
