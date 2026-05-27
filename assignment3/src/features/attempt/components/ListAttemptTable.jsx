import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
} from "react-native";
import ListAttemptRow from "./ListAttemptRow";
import { fetchAttemptsByQuizId } from "../services/attemptApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import ListFooter from "../../../components/ui/ListFooter";
import FilterBar from "../../../components/ui/FilterBar";

/**
 * ListAttemptTable component displays a paginated list of quiz attempts.
 *
 * @param {string} quizId - The ID of the quiz to filter attempts for
 */
export default function ListAttemptTable({ quizId }) {
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    sort: "-updatedAt",
    status: "",
  });

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "All", value: "" },
        { label: "Submitted", value: "submitted" },
        { label: "Saved", value: "saved" },
      ],
    },
    {
      key: "sort",
      label: "Sort By",
      options: [
        { label: "Newest", value: "-updatedAt" },
        { label: "Oldest", value: "updatedAt" },
        { label: "Highest Score", value: "-score" },
        { label: "Lowest Score", value: "score" },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    loadAttempts(1, true);
  };

  const loadAttempts = useCallback(
    async (pageNum, isRefresh = false) => {
      if (loading && !isRefresh) return;

      setLoading(true);
      try {
        const params = {
          page: pageNum,
          limit: 10,
          sort: selectedFilters.sort,
        };

        if (selectedFilters.status) params.status = selectedFilters.status;

        const response = await fetchAttemptsByQuizId(quizId, params);
        if (response) {
          const { data: newAttempts, linkHeader } = response;
          setDisplayData((prev) =>
            isRefresh ? newAttempts : [...prev, ...newAttempts],
          );
          setHasMore(!!linkHeader?.next);
          setPage(pageNum);
        }
      } catch (error) {
        ShowErrorNotification(error, "Failed to load attempts");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [quizId, selectedFilters],
  );

  useEffect(() => {
    loadAttempts(1, true);
  }, [quizId, selectedFilters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAttempts(1, true);
  }, [loadAttempts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadAttempts(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FilterBar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
      <FlatList
        data={displayData}
        renderItem={({ item }) => <ListAttemptRow {...item} />}
        keyExtractor={(item, index) =>
          item._id?.toString() || item.id?.toString() || index.toString()
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No attempts found for this quiz.
              </Text>
            </View>
          )
        }
        ListFooterComponent={() => ListFooter(loading, refreshing)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
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
