/**
 * @file GroupList.jsx
 * @description Component for rendering a scrollable list of groups with support for pagination and refresh.
 */
import React from "react";
import { FlatList, StyleSheet, RefreshControl, View, Text } from "react-native";
import Group from "./Group";
import ListFooter from "../../../components/ui/ListFooter";
import { useTheme } from "../../../app/providers/ThemeContext";
import { useNavigation } from "@react-navigation/native";

/**
 * GroupList component.
 *
 * @param {Object} props - Component props
 * @param {Array} props.groups - Array of group objects to display
 * @param {boolean} props.loading - Loading state for the list
 * @param {boolean} props.refreshing - Refreshing state for pull-to-refresh
 * @param {Function} props.onRefresh - Callback for pull-to-refresh action
 * @param {Function} props.handleLoadMore - Callback for infinite scroll pagination
 * @returns {JSX.Element} The rendered flat list of groups.
 */
export default function GroupList({
  groups,
  loading,
  refreshing,
  onRefresh,
  handleLoadMore,
}) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => (
        <Group
          id={item._id}
          name={item.name}
          memberCount={item.memberCount}
          isAdmin={item.isAdmin}
          onActionPress={() =>
            navigation.navigate("EditGroup", { groupId: item._id })
          }
        />
      )}
      keyExtractor={(item, index) =>
        item._id?.toString() || `group-idx-${index}`
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={
        !loading &&
        !refreshing && (
          <View
            style={[
              styles.emptyContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No groups found
            </Text>
          </View>
        )
      }
      ListFooterComponent={() => (
        <ListFooter loading={loading} refreshing={refreshing} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
