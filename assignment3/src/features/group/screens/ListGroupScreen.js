import React, { useState, useCallback, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator, RefreshControl, View, Text } from "react-native";
import Group from "../components/Group";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchGroups } from "../services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";

export default function ListGroupScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ role: "All" });
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    {
      key: "role",
      label: "Role",
      options: ["All", "Admin", "Member"],
    },
    {
      key: "sort",
      label: "Sort By",
      options: ["Newest", "Oldest", "Name"],
    },
  ];

  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fetchGroups = useCallback(async (pageNum, isRefresh = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        search: keyword,
        role: selectedFilters.role !== "All" ? selectedFilters.role.toLowerCase() : undefined,
        sort: selectedFilters.sort,
      };

      const response = await fetchGroups(params);
      const { data: newGroups, linkHeader } = response;
      

      setDisplayData(prev => isRefresh ? newGroups : [...prev, ...newGroups]);
      // Check if linkHeader contains 'rel="next"' to determine if more pages exist
      setHasMore(linkHeader.includes('rel="next"'));
      setPage(pageNum);
    } catch (error) {
      ShowErrorNotification(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [keyword, selectedFilters]);

  useEffect(() => {
    fetchGroups(1, true);
  }, [keyword, selectedFilters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups(1, true);
  }, [fetchGroups]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchGroups(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#0000ff" />
    );
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
            onActionPress={() => navigation.navigate("EditGroup", { groupId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No groups found</Text>
            </View>
          )
        }
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
