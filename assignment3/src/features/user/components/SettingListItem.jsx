import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * SettingListItem component renders a single row in a settings list.
 * It displays an icon, a title, and a chevron to indicate navigability.
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - The setting item data
 * @param {string} props.item.title - The text to display
 * @param {string} props.item.icon - The name of the icon to display
 * @param {Function} props.item.onPress - Callback function when the item is pressed
 */
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
