import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import Group from "../components/Group";
import MainContainer from "../../../components/layout/MainContainer";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";

const groups = [
  { id: "1", name: "React Native Developers", memberCount: 120, isAdmin: true },
  { id: "2", name: "UI/UX Enthusiasts", memberCount: 85, isAdmin: false },
  { id: "3", name: "AI Quiz Masters", memberCount: 45, isAdmin: true },
];

export default function ListGroupScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ role: "All" });

  const filters = [
    {
      key: "role",
      label: "Role",
      options: ["All", "Admin", "Member"],
    },
  ];

  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const matchesRole =
      selectedFilters.role === "All" ||
      (selectedFilters.role === "Admin" && group.isAdmin) ||
      (selectedFilters.role === "Member" && !group.isAdmin);
    return matchesSearch && matchesRole;
  });

  return (
    <MainContainer title="My Groups" navigation={navigation} isMain={true}>
      <SearchBar
        placeholder="Search groups..."
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <FilterBar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <Group
            name={item.name}
            memberCount={item.memberCount}
            isAdmin={item.isAdmin}
            onActionPress={() => console.log(`Managing ${item.name}`)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
