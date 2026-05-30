import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "../../../app/providers/ThemeContext";

export default function SettingListItem({ item }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={item.onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Icon name={item.icon} color={theme.colors.primary} size={24} />

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
      </View>

      <Icon
        name="chevron-right"
        type="material-community"
        color="#999"
        size={22}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  title: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
