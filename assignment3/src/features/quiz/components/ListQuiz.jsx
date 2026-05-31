import React from "react";
import { FlatList, View, Text, RefreshControl, StyleSheet } from "react-native";
import QuizItem from "./QuizItem";
import ListFooter from "../../../components/ui/ListFooter";
import { useTheme } from "../../../app/providers/ThemeContext";

/**
 * ListQuiz component renders a scrollable list of quiz cards.
 * It supports pull-to-refresh, infinite scrolling, and displays an empty state.
 *
 * @param {Object} props - Component props
 * @param {Array|null} props.quizzes - Array of quiz data objects to display
 * @param {boolean} props.refreshing - Indicates if the list is currently refreshing
 * @param {Function} props.onRefresh - Callback function for pull-to-refresh
 * @param {Function} props.handleLoadMore - Callback function for infinite scroll
 * @param {boolean} props.loading - Indicates if data is currently being fetched
 */
export default function ListQuiz({
  quizzes,
  refreshing,
  onRefresh,
  handleLoadMore,
  loading,
}) {
  const { theme } = useTheme();

  return (
    <FlatList
      data={quizzes}
      renderItem={({ item }) => <QuizItem quiz={item} />}
      keyExtractor={(item, index) =>
        item._id?.toString() || item.id?.toString() || `quiz-${index}`
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      ListEmptyComponent={
        !loading &&
        quizzes !== null && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No quizzes found
            </Text>
          </View>
        )
      }
      ListFooterComponent={() => (
        <ListFooter loading={loading} refreshing={refreshing} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
