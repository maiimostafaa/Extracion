import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import BrewLogFilterButton from "./filter-button";
import { brewLogFilter } from "../../types/brew-log/brew-log-filter";

type filterOptions =
  | "All"
  | "Pour Over"
  | "Cold Brew"
  | "Brew Bar"
  | "French Press";

interface BrewLogFilterSelectorProps {
  selectedFilter: filterOptions; // Current value stored on the screen
  onFilterChange: (filter: filterOptions) => void; // Function in order to update the parent
}

const BrewLogFilterSelector: React.FC<BrewLogFilterSelectorProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filterOptions: brewLogFilter[] = [
    { id: 5, label: "All" },
    {
      id: 1,
      icon: require("../../graphics/brewing-methods/pour-over.png"),
      label: "Pour Over",
    },
    {
      id: 2,
      icon: require("../../graphics/brewing-methods/cold-brew.png"),
      label: "Cold Brew",
    },
    {
      id: 3,
      icon: require("../../graphics/brewing-methods/brew-bar.png"),
      label: "Brew Bar",
    },
    {
      id: 4,
      icon: require("../../graphics/brewing-methods/french-press.png"),
      label: "French Press",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((filterOption) => (
          <View key={filterOption.id} style={styles.buttonWrapper}>
            <BrewLogFilterButton
              brewLogFilter={filterOption}
              isSelected={selectedFilter === filterOption.label}
              onPress={() => {
                onFilterChange(filterOption.label as filterOptions);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
});

export default BrewLogFilterSelector;
