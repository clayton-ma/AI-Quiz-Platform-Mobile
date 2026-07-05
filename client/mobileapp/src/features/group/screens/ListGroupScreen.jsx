/**
 * @file ListGroupScreen.jsx
 * @description Screen component for displaying, searching, and filtering the user's groups.
 */
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchGroups as fetchGroupsApi } from "../services/groupApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import CreateButton from "../../../components/ui/CreateButton";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupList from "../components/GroupList";

/**
 * ListGroupScreen component.
 *
 * Displays a searchable and filterable list of groups.
 * Supports pagination, pull-to-refresh, and group creation via a modal.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered group list screen.
 */
export default function ListGroupScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ role: "All" });
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

  /**
   * Updates the selected filter state.
   *
   * @param {string} key - The filter key to update
   * @param {string} value - The new filter value
   */
  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Fetches groups from the API based on current search, filters, and page.
   *
   * @param {number} pageNum - The page number to fetch
   * @param {boolean} isRefresh - Whether this is a refresh action (resets list)
   */
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

  // Trigger initial load and reload on filter/search changes
  useEffect(() => {
    fetchGroups(1, true);
  }, [keyword, selectedFilters, fetchGroups]);

  /** Handles pull-to-refresh action */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups(1, true);
  }, [fetchGroups]);

  /**
   * Handles infinite scroll loading.
   */
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
      <GroupList
        groups={displayData}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        handleLoadMore={handleLoadMore}
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

const styles = StyleSheet.create({});
