import React, { useState, useCallback, useEffect } from "react";
import { FlatList, StyleSheet, RefreshControl, View, Text } from "react-native";
import Group from "../components/Group";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchGroups as fetchGroupsApi } from "../services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import CreateButton from "../../../components/ui/CreateButton";
import ListFooter from "../../../components/ui/ListFooter";
import CreateGroupModal from "../components/CreateGroupModal";
import { useTheme } from "../../../app/providers/ThemeContext";

export default function ListGroupScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ role: "All" });
  const { theme } = useTheme();
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const filters = [
    {
      key: "role",
      label: "Role",
      options: [
        { label: "All", value: "" },
        { label: "Admin", value: "Admin" },
        { label: "Member", value: "Member" },
      ],
    },
  ];

  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fetchGroups = useCallback(
    async (pageNum, isRefresh = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = {
          page: pageNum,
          limit: 10,
          search: keyword,
          role:
            selectedFilters.role !== "All"
              ? selectedFilters.role.toLowerCase()
              : undefined,
          sort: selectedFilters.sort,
        };

        const response = await fetchGroupsApi(params);
        if (response) {
          const { data: newGroups, linkHeader } = response;
          setDisplayData((prev) =>
            isRefresh ? newGroups : [...prev, ...newGroups],
          );
          // Check if linkHeader contains 'rel="next"' to determine if more pages exist
          setHasMore(!!linkHeader.next);
          setPage(pageNum);
        }
      } catch (error) {
        ShowErrorNotification(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [keyword, selectedFilters],
  );

  useEffect(() => {
    fetchGroups(1, true);
  }, [keyword, selectedFilters, fetchGroups]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups(1, true);
  }, [fetchGroups]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchGroups(page + 1);
    }
  };

  return (
    <MainContainer title="My Groups" navigation={navigation} isMain={true}>
      <SearchBar
        placeholder="Search groups..."
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <FilterBar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
      <FlatList
        data={displayData}
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
        ListFooterComponent={() => ListFooter(loading, refreshing)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <CreateButton handlePress={() => setIsCreateModalVisible(true)} />
      <CreateGroupModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        navigation={navigation}
      />
    </MainContainer>
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
