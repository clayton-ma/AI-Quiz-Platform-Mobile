import React from "react";
import { FlatList } from "react-native";
import QuizItem from "./QuizItem";

export default function ListQuiz({ quizzes, refreshControl }) {
  return (
    <FlatList
      data={quizzes}
      refreshControl={refreshControl}
      renderItem={({ item }) => <QuizItem item={item} />}
      keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
    />
  );
}
