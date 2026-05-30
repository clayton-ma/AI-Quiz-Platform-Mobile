import React from "react";
import { FlatList, View, Text, RefreshControl, StyleSheet } from "react-native";
import QuizItem from "./QuizItem";
import ListFooter from "../../../components/ui/ListFooter";
import { useTheme } from "../../../app/providers/ThemeContext";

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
        item._id?.toString() || index.toString() || `quiz-${index}`
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
