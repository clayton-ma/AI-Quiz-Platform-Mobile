import React from "react";
import { FlatList } from "react-native";
import QuizItem from "./QuizItem";

export default function ListQuiz({ quizzes }) {
  return (
    <FlatList
      data={quizzes}
      renderItem={({ item }) => <QuizItem item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
