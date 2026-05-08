import React from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar as RNElementsSearchBar } from "react-native-elements";

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
  return (
    <View style={styles.container}>
      <RNElementsSearchBar
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        inputStyle={styles.text}
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
    backgroundColor: "#e9e9e9",
  },
  text: {
    color: "#2C3E50",
  },
});
