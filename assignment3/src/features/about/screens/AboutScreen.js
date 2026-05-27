import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import MainContainer from "../../../components/layout/MainContainer";
import { Icon, Card } from "react-native-elements";
import { useTheme } from "../../../app/providers/ThemeContext";
import { BackgroundColor } from "../../../../constants";

const features = [
  {
    icon: "psychology",
    title: "AI Question Generation",
    description:
      "Generate high-quality quiz questions instantly using AI tailored to your topics and difficulty levels.",
  },
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
    icon: "replay",
    title: "Multiple Attempts",
    description:
      "Allow users to retake quizzes and improve their scores through repeated practice and learning.",
  },
];

const { width } = Dimensions.get("window");

export default function About({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <MainContainer title="About" isMain={true} navigation={navigation}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Master Your Skills with{" "}
            <Text style={[styles.highlight, { color: theme.colors.primary }]}>
              QuizApp
            </Text>
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.dark ? "#909296" : "#7f8c8d" },
            ]}
          >
            The all-in-one platform for creating quizzes, managing study groups,
            and tracking your academic progress in real-time.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.featuresGrid, { opacity: fadeAnim }]}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Card
                containerStyle={[
                  styles.cardOverride,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.cardContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          feature.title === "AI Question Generation"
                            ? "#E67E22"
                            : theme.colors.primary,
                      },
                    ]}
                  >
                    <Icon name={feature.icon} color="#fff" size={26} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: theme.dark ? "#909296" : "#95a5a6" },
                      ]}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heroSection: { alignItems: "center", marginBottom: 40, marginTop: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "left",
    color: "#2C3E50",
    marginBottom: 15,
  },
  highlight: { color: BackgroundColor },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "left",
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: "column",
  },
  featureCard: { marginBottom: 15 },
  cardOverride: {
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    backdropFilter: "blur(10px)",
  },
  textContainer: { flex: 1, marginLeft: 15 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#95a5a6",
    lineHeight: 20,
  },
});
