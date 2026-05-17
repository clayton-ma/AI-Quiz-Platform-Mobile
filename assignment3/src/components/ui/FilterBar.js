import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { Button, Icon, ListItem } from "react-native-elements";
import { BackgroundColor } from "../../../constants";

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
                  <View style={styles.modalContent}>
                    {filter.options.map(({ value, label }) => (
                      <ListItem
                        key={value}
                        bottomDivider
                        onPress={() => handleSelect(filter.key, value)}
                      >
                        <ListItem.Content>
                          <ListItem.Title>{label}</ListItem.Title>
                        </ListItem.Content>
                        {currentValue === value && (
                          <Icon name="check" color={BackgroundColor} />
                        )}
                      </ListItem>
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
    borderColor: BackgroundColor,
  },
  activeTitle: {
    color: "#fff",
  },
  inactiveTitle: {
    color: BackgroundColor,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: "60%",
  },
});
