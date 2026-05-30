import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { Button, Icon } from "@rneui/themed";
import { useTheme } from "../../app/providers/ThemeContext";

/**
 * A reusable FilterBar component with dropdown support and multi-field filtering.
 *
 * @param {Array} filters - Array of filter objects { key, label, options }.
 * @param {Object} selectedFilters - Object mapping keys to selected values.
 * @param {function} onFilterChange - Callback when a filter value changes.
 */
export default function FilterBar({
  filters = [],
  selectedFilters = {},
  onFilterChange,
}) {
  const [visibleModal, setVisibleModal] = useState(null);
  const { theme } = useTheme();
  const BackgroundColor = theme.colors.primary;

  const handleSelect = (key, value) => {
    onFilterChange(key, value);
    setVisibleModal(null);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const currentValue = selectedFilters[filter.key];
          const selectedOption =
            filter.options.find((opt) => opt.value === currentValue) ||
            filter.options[0];
          const displayLabel = selectedOption?.label || "All";
          const isActive =
            currentValue !== "" &&
            currentValue !== "All" &&
            currentValue !== undefined;

          return (
            <View key={filter.key}>
              <Button
                title={`${filter.label}: ${displayLabel}`}
                type={isActive ? "solid" : "outline"}
                onPress={() => setVisibleModal(filter.key)}
                iconRight
                icon={
                  <Icon
                    name="arrow-drop-down"
                    color={isActive ? "#fff" : BackgroundColor}
                  />
                }
                buttonStyle={[
                  styles.button,
                  isActive && { backgroundColor: BackgroundColor },
                ]}
                titleStyle={[
                  styles.title,
                  isActive ? styles.activeTitle : styles.inactiveTitle,
                ]}
                containerStyle={styles.buttonContainer}
              />

              <Modal
                visible={visibleModal === filter.key}
                transparent={true}
                animationType="fade"
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setVisibleModal(null)}
                >
                  <View
                    style={[
                      styles.modalContent,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    {filter.options.map(({ value, label }) => (
                      <TouchableOpacity
                        key={value}
                        onPress={() => handleSelect(filter.key, value)}
                        style={[
                          styles.optionItem,
                          { borderBottomColor: theme.colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: theme.colors.text,
                              fontWeight:
                                currentValue === value ? "bold" : "normal",
                            },
                          ]}
                        >
                          {label}
                        </Text>
                        {currentValue === value && (
                          <Icon
                            name="check"
                            color={BackgroundColor}
                            size={20}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  buttonContainer: {
    marginRight: 10,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  activeTitle: {
    color: "#fff",
  },
  title: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: "60%",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
