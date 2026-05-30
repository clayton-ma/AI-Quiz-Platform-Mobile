import React from "react";
import { FlatList, StyleSheet, RefreshControl, View, Text } from "react-native";
import Group from "./Group";
import ListFooter from "../../../components/ui/ListFooter";
import { useTheme } from "../../../app/providers/ThemeContext";
import { useNavigation } from "@react-navigation/native";

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
          name={item.name}
          memberCount={item.memberCount}
          isAdmin={item.isAdmin}
          onActionPress={() =>
            navigation.navigate("EditGroup", { groupId: item._id })
          }
        />
      )}
      keyExtractor={(item, index) => item._id || `group-idx-${index}`}
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    color: "#7F8C8D",
  },
});
