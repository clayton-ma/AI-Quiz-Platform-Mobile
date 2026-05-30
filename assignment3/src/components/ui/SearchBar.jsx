import React from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar as RNElementsSearchBar } from "react-native-elements";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * A reusable SearchBar component styled for the application.
 *
 * @param {string} value - The current search text.
 * @param {function} onChangeText - Callback function when text changes.
 * @param {string} placeholder - Placeholder text for the input.
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <RNElementsSearchBar
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        lightTheme={!theme.dark}
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={[
          styles.searchInput,
          { backgroundColor: theme.colors.card },
        ]}
        inputStyle={[styles.text, { color: theme.colors.text }]}
        placeholderTextColor={theme.dark ? "#909296" : "#666"}
        searchIcon={{ color: theme.dark ? "#909296" : "#666" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    elevation: 2,
  },
});
