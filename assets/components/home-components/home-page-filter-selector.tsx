import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import BrewLogFilterButton from "../brew-log-components/filter-button";
import { brewLogFilter } from "../../types/brew-log/brew-log-filter";

type filterOptions = "All" | "Coffee Recipe" | "KOL Featuring" | "Promotion";

interface HomePageFilterSelectorProps {
  selectedFilter: filterOptions; // Current value stored on the screen
  onFilterChange: (filter: filterOptions) => void; // Function in order to update the parent
}

const HomePageFilterSelector: React.FC<HomePageFilterSelectorProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filterOptions: brewLogFilter[] = [
    {
      id: 1,
      icon: require("../../graphics/home-filter-icons/all.png"),
      label: "All",
    },
    {
      id: 2,
      icon: require("../../graphics/home-filter-icons/coffee-recipe.png"),
      label: "Coffee Recipe",
    },
    {
      id: 3,
      icon: require("../../graphics/home-filter-icons/KOL.png"),
      label: "KOL Featuring",
    },
    {
      id: 4,
      icon: require("../../graphics/home-filter-icons/promotion.png"),
      label: "Promotion",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        {filterOptions.map((filterOption) => (
          <View key={filterOption.id} style={styles.buttonWrapper}>
            <BrewLogFilterButton
              brewLogFilter={filterOption}
              isSelected={selectedFilter === filterOption.label}
              onPress={() => {
                console.log("Button pressed:", filterOption.label); // This is just to test whether it can actually read the change from the button or not
                onFilterChange(filterOption.label as filterOptions);
              }}
            />
          </View>
        ))}
      </View>
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

    flexDirection: "row",
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
});

export default HomePageFilterSelector;
