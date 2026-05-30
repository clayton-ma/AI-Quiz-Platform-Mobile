import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import QuizItem from "../components/QuizItem";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { fetchQuizzes } from "../services/quizApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import CreateButton from "../../../components/ui/CreateButton";
import { useTheme } from "../../../app/providers/ThemeContext";
import ListQuiz from "../components/ListQuiz";

export default function ListQuizScreen({ navigation }) {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ status: "All" });
  const [displayData, setDisplayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

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
    [keyword, selectedFilters, loading],
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
  listContent: {
    paddingBottom: 80,
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
