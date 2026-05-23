import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { fetchAttempts } from "../services/attemptApi";
import ListAttemptRow from "./ListAttemptRow";

/**
 * ListAttemptTable component renders a list of quiz attempts for mobile.
 * Includes sorting functionality by date.
 *
 * @param {Object[]} attempts - Array of attempt objects.
 * @param {Function} setAttempts - Callback to update attempts state.
 * @param {Object} params - Current query parameters (sort, filter).
 * @param {Function} onParamsChange - Callback to update query parameters.
 */
export default function ListAttemptTable({
  attempts,
  setAttempts,
  params,
  onParamsChange,
}) {
  const sortOrder = params.sort === "updatedAt" ? "desc" : "asc";

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const data = await fetchAttempts(params);
        setAttempts(data);
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    };
    loadAttempts();
  }, [params]);

  const filter = params.status || "all";

  const toggleSort = () => {
    onParamsChange({
      ...params,
      sort: sortOrder === "desc" ? "-updatedAt" : "updatedAt",
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Recent Attempts</Text>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
            <Text style={styles.sortText}>
              Date {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Text>
            <Icon
              name={sortOrder === "desc" ? "arrow-downward" : "arrow-upward"}
              size={16}
              color="#2980B9"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {["all", "saved", "submitted"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
              onPress={() =>
                onParamsChange({
                  ...params,
                  status: f === "all" ? undefined : f,
                })
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === f && styles.filterChipTextActive,
                ]}
              >
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={attempts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ListAttemptRow {...item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No attempts found matching your criteria.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7F8C8D",
    textTransform: "uppercase",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: { fontSize: 12, color: "#2980B9", fontWeight: "600" },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#E5E7E9",
  },
  filterChipActive: {
    backgroundColor: "#2980B9",
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#7F8C8D",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#7F8C8D",
    fontSize: 16,
    textAlign: "center",
  },
});
