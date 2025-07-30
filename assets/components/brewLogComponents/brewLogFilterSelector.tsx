import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import BrewLogFilterButton from "./brewLogFilterButton";
import { brewLogFilter } from "../../types/BrewLog/brewLogFilter";

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
    { id: 1, icon: require("./icons/pour_over.png"), label: "Pour Over" },
    { id: 2, icon: require("./icons/cold_brew.png"), label: "Cold Brew" },
    { id: 3, icon: require("./icons/brew_bar.png"), label: "Brew Bar" },
    { id: 4, icon: require("./icons/french_press.png"), label: "French Press" },
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
