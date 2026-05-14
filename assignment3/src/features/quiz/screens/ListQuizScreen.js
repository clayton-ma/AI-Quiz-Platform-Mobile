import React, { useState, useMemo } from "react";
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

const mockQuizzes = [
  {
    id: "1",
    name: "General Knowledge",
    status: "Published",
    group: "React Native Developers",
    lastUpdated: "2023-10-25",
    instant_result: true,
  },
  {
    id: "2",
    name: "React Native Basics",
    status: "Draft",
    group: "UI/UX Enthusiasts",
    lastUpdated: "2023-10-27",
    instant_result: false,
  },
];

export default function ListQuizScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "All",
    sort: "Newest",
  });

  const filters = [
    {
      key: "status",
      label: "Status",
      options: ["All", "Published", "Draft"],
    },
    {
      key: "sort",
      label: "Sort",
      options: ["Newest", "Oldest"],
    },
  ];

  const filteredAndSortedQuizzes = useMemo(() => {
    let result = mockQuizzes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.group.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        selectedFilters.status === "All" ||
        item.status === selectedFilters.status;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.lastUpdated);
      const dateB = new Date(b.lastUpdated);
      return selectedFilters.sort === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, selectedFilters]);

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={styles.headerRow}>
          <ListItem.Title style={styles.quizName}>{item.name}</ListItem.Title>
          <Badge
            value={item.status}
            status={item.status === "Published" ? "success" : "warning"}
          />
        </View>
        <ListItem.Subtitle style={styles.subtitle}>
          Group: {item.group}
        </ListItem.Subtitle>
        <View style={styles.resultRow}>
          <Icon
            name={item.instant_result ? "visibility" : "visibility-off"}
            size={14}
            color="#7F8C8D"
          />
          <Text style={styles.resultText}>
            Instant Results: {item.instant_result ? "On" : "Off"}
          </Text>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {item.lastUpdated}</Text>
      </ListItem.Content>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditQuiz", { quizId: item.id })}
        >
          <Icon name="edit" color={BackgroundColor} size={24} />
        </TouchableOpacity>
      </View>
    </ListItem>
  );

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
      <FlatList
        data={filteredAndSortedQuizzes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateQuiz")}
      >
        <Icon name="add" color="#fff" size={30} />
      </TouchableOpacity>
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: BackgroundColor,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
