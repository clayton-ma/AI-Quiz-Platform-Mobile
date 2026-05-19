import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ListItem, Icon, Badge } from "react-native-elements";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import { BackgroundColor } from "../../../../constants";
import ListQuiz from "../components/ListQuiz";
import { fetchQuizzes } from "../services/quizApi";
import ShowErrorNotification from "../../../components/ui/ShowErrorNotification";
import { ActivityIndicator, RefreshControl } from "react-native";
import parseLinkHeader from "../../../utils/parseLinkHeader";
import CreateButton from "../../../components/ui/CreateButton";

export default function ListQuizScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "All",
    sort: "newest",
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paginationLinks, setPaginationLinks] = useState({});

  const loadQuizzes = useCallback(
    async (isRefresh = false) => {
      if (loading) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {
          search: search || undefined,
          sort: selectedFilters.sort,
        };
        const response = await fetchQuizzes(params);
        if (response) {
          setQuizzes(response.data || []);
          const linkHeader = response.linkHeader || "";
          const links = parseLinkHeader(linkHeader);
          setPaginationLinks(links);
        }
      } catch (error) {
        ShowErrorNotification(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, selectedFilters],
  );

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const onRefresh = useCallback(() => {
    loadQuizzes(true);
  }, [loadQuizzes]);

  const filters = [
    {
      key: "sort",
      label: "Sort",
      options: [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Name (A-Z)", value: "name" },
        { label: "Status", value: "status" },
      ],
    },
  ];

  return (
    <MainContainer
      title="Quiz Management"
      navigation={navigation}
      isMain={true}
    >
      <SearchBar
        placeholder="Search quizzes..."
        value={search}
        onChangeText={setSearch}
      />
      <FilterBar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={(key, val) =>
          setSelectedFilters((prev) => ({ ...prev, [key]: val }))
        }
      />
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={BackgroundColor}
          style={{ marginTop: 20 }}
        />
      ) : (
        <ListQuiz
          quizzes={quizzes}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <CreateButton handlePress={() => navigation.navigate("CreateQuiz")} />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  quizName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2C3E50",
  },
  subtitle: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  resultText: {
    color: "#7F8C8D",
    fontSize: 12,
    marginLeft: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
