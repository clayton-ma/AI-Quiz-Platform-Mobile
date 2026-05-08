import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import MainHeader from "../../components/ui/MainHeader";
import { BackgroundColor } from "../../../constants";
import { debounce } from "lodash";
import MainContainer from "../../components/layout/MainContainer";

/**
 * QuizList component displays a paginated, searchable, and sortable list of quizzes.
 * Converted to React Native for mobile.
 */
export default function QuizList({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [displayQuizzes, setDisplayQuizzes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  /**
   * Mock fetch for quizzes
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Mock data matching the app's theme
      const mockQuizzes = [
        {
          id: "1",
          title: "General Knowledge",
          questions: 10,
          status: "Active",
        },
        {
          id: "2",
          title: "React Native Basics",
          questions: 5,
          status: "Draft",
        },
        {
          id: "3",
          title: "Pokemon Master Quiz",
          questions: 15,
          status: "Active",
        },
      ];
      setQuizzes(mockQuizzes);
      setDisplayQuizzes(mockQuizzes);
      setLoading(false);
    };
    fetchData();
  }, []);

  const searchQuiz = useCallback(
    debounce((text) => {
      if (text === "") {
        setDisplayQuizzes(quizzes);
      } else {
        const filtered = quizzes.filter((q) =>
          q.title.toLowerCase().includes(text.toLowerCase()),
        );
        setDisplayQuizzes(filtered);
      }
    }, 500),
    [quizzes],
  );

  const handleSearch = (text) => {
    setKeyword(text);
    searchQuiz(text);
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => navigation.navigate("QuizDetail", { quiz: item })}
    >
      <Icon name="assignment" color={BackgroundColor} />
      <ListItem.Content>
        <ListItem.Title style={styles.quizTitle}>{item.title}</ListItem.Title>
        <ListItem.Subtitle>
          {item.questions} Questions • {item.status}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <MainContainer title="Quizzes" navigation={navigation} isMain={true}>
      <SearchBar
        placeholder="Search quizzes..."
        value={keyword}
        onChangeText={handleSearch}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={BackgroundColor}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={displayQuizzes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 15,
  },
  searchInput: {
    backgroundColor: "#e9e9e9",
  },
  listContent: {
    paddingBottom: 80,
  },
  quizTitle: {
    fontWeight: "bold",
    color: "#2C3E50",
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
