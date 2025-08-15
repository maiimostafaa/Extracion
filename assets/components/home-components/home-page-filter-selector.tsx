// README
// Horizontal filter selector for the Home page.
// Features:
// - Displays a row of filter buttons (All, Coffee Recipe, KOL Featuring, Promotion).
// - Highlights the currently selected filter.
// - Calls `onFilterChange` when a filter is selected.
// Notes:
// - Uses BrewLogFilterButton component for consistent styling with other filter buttons.
// - Accepts `selectedFilter` from parent to determine which filter is active.
// - Parent component must handle state for `selectedFilter` and pass `onFilterChange` handler.

// -------------------- Imports --------------------
import React from "react";
import { View, StyleSheet } from "react-native";
import BrewLogFilterButton from "../brew-log-components/filter-button";
import { brewLogFilter } from "../../types/brew-log/brew-log-filter";

// -------------------- Types --------------------
type filterOptions = "All" | "Coffee Recipe" | "KOL Featuring" | "Promotion";

interface HomePageFilterSelectorProps {
  selectedFilter: filterOptions; // Currently selected filter label
  onFilterChange: (filter: filterOptions) => void; // Callback to update selected filter in parent
}

// -------------------- Component --------------------
const HomePageFilterSelector: React.FC<HomePageFilterSelectorProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  // Static list of available filter options
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
        {/* Map through each filter option and render a BrewLogFilterButton */}
        {filterOptions.map((filterOption) => (
          <View key={filterOption.id} style={styles.buttonWrapper}>
            <BrewLogFilterButton
              brewLogFilter={filterOption}
              isSelected={selectedFilter === filterOption.label} // Determine if this filter is active
              onPress={() => {
                console.log("Button pressed:", filterOption.label); // Debug: logs selected filter
                onFilterChange(filterOption.label as filterOptions); // Update parent state
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    height: 80, // Fixed height for the filter selector row
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row", // Horizontal layout for buttons
  },
  buttonWrapper: {
    marginHorizontal: 8, // Spacing between buttons
  },
});

// -------------------- Export --------------------
export default HomePageFilterSelector;
