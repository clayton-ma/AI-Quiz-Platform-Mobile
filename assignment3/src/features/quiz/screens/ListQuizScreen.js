import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
} from "react-native";
import QuizItem from "../components/QuizItem";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchQuizzes } from "../services/quizApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import CreateButton from "../../../components/ui/CreateButton";
import ListFooter from "../../../components/ui/ListFooter";

export default function ListQuizScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ status: "All" });
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "All", value: "" },
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      key: "sort",
      label: "Sort By",
      options: [
        { label: "All", value: "" },
        { label: "Newest", value: "updatedAt" },
        { label: "Oldest", value: "-updatedAt" },
        { label: "Name", value: "name" },
      ],
    },
  ];

  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loadQuizzes = useCallback(
    async (pageNum, isRefresh = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const params = {
          page: pageNum,
          limit: 10,
          search: keyword,
          status:
            selectedFilters.status !== "All"
              ? selectedFilters.status.toLowerCase()
              : undefined,
          sort: selectedFilters.sort,
        };

        const response = await fetchQuizzes(params);
        if (response) {
          const { data: newQuizzes, linkHeader } = response;
          setDisplayData((prev) =>
            isRefresh ? newQuizzes : [...prev, ...newQuizzes],
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
    loadQuizzes(1, true);
  }, [keyword, selectedFilters, loadQuizzes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadQuizzes(1, true);
  }, [loadQuizzes]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadQuizzes(page + 1);
    }
  };

  return (
    <MainContainer title="My Quizzes" navigation={navigation} isMain={true}>
      <SearchBar
        placeholder="Search quizzes..."
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
        renderItem={(item) => <QuizItem quiz={item} />}
        keyExtractor={(item, index) =>
          item._id?.toString() || item.id?.toString() || index.toString()
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No quizzes found</Text>
            </View>
          )
        }
        ListFooterComponent={ListFooter(loading, refreshing)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <CreateButton handlePress={() => navigation.navigate("CreateQuiz")} />
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
