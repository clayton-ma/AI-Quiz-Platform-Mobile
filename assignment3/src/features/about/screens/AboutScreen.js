import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MainHeader from "../../../components/MainHeader";
import { Icon } from "react-native-elements";
import { BackgroundColor } from "../../../../constants";

const features = [
  {
    icon: "book",
    title: "Interactive Quizzes",
    description:
      "Create and participate in dynamic quizzes designed to test and improve your knowledge across various subjects.",
  },
  {
    icon: "groups",
    title: "Collaborative Groups",
    description:
      "Join study groups, manage members, and collaborate with peers to achieve collective learning goals.",
  },
  {
    icon: "psychology",
    title: "AI Question Generation",
    description:
      "Generate high-quality quiz questions instantly using AI tailored to your topics and difficulty levels.",
  },
  {
    icon: "replay",
    title: "Multiple Attempts",
    description:
      "Allow users to retake quizzes and improve their scores through repeated practice and learning.",
  },
];

export default function About({ navigation }) {
  return (
    <View style={styles.container}>
      <MainHeader title="About" isMain={true} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            Master Your Skills with{" "}
            <Text style={styles.highlight}>QuizApp</Text>
          </Text>

          <Text style={styles.subtitle}>
            The all-in-one platform for creating quizzes, managing study groups,
            and tracking your academic progress in real-time.
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <Icon name={feature.icon} color="#fff" size={26} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heroSection: { alignItems: "center", marginBottom: 40, marginTop: 20 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 15,
  },
  highlight: { color: BackgroundColor },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "100%",
    marginBottom: 30,
    padding: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: BackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#95a5a6",
    lineHeight: 20,
  },
});
