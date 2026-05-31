import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchQuizzes } from "../services/quizApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import CreateButton from "../../../components/ui/CreateButton";
import ListQuiz from "../components/ListQuiz";

/**
 * ListQuizScreen component.
 *
 * Displays a searchable and filterable list of quizzes created by the user.
 * Supports pagination, pull-to-refresh, and navigation to quiz creation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} The rendered quiz list screen.
 */
export default function ListQuizScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ status: "All" });
  const [displayData, setDisplayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  /**
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    {
      key: "sort",
      label: "Sort By",
      options: [
        { label: "All", value: "" },
        { label: "Newest", value: "-updatedAt" },
        { label: "Oldest", value: "updatedAt" },
        { label: "Status", value: "status" },
        { label: "Name", value: "name" },
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
   * Fetches quizzes from the API based on current search, filters, and page.
   *
   * @param {number} pageNum - The page number to fetch
   * @param {boolean} isRefresh - Whether this is a refresh action (resets list)
   */
  const loadQuizzes = useCallback(
    async (pageNum, isRefresh = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const queryParams = {
          page: pageNum,
          limit: 10,
          search: keyword,
          status:
            selectedFilters.status !== "All"
              ? selectedFilters.status.toLowerCase()
              : undefined,
          sort: selectedFilters.sort,
        };

        const response = await fetchQuizzes(queryParams);
        if (response) {
          const { data: newQuizzes, linkHeader } = response;
          setDisplayData((prev) =>
            isRefresh || prev === null ? newQuizzes : [...prev, ...newQuizzes],
          );

          setHasMore(!!linkHeader?.next);
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
    loadQuizzes(1, true);
  }, [keyword, selectedFilters, loadQuizzes]);

  /**
   * Handles pull-to-refresh action.
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadQuizzes(1, true);
  }, [loadQuizzes]);

  /**
   * Handles infinite scroll loading.
   */
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadQuizzes(page + 1);
    }
  };

  return (
    <MainContainer title="My Quizzes" navigation={navigation} isMain={true}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search quizzes..."
          value={keyword}
          onChangeText={setKeyword}
        />
        <FilterBar
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        <ListQuiz
          quizzes={displayData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          handleLoadMore={handleLoadMore}
          loading={loading}
        />
      </View>
      <CreateButton handlePress={() => navigation.navigate("CreateQuiz")} />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
