import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import BrewLogFilterButton from "./brewLogFilterButton";
import { brewLogFilter } from "../../types/BrewLog/brewLogFilter";


type filterOptions = 'all' | 'pour over' | 'cold brew' | 'brew bar' | 'french press';

interface BrewLogFilterSelectorProps {
    selectedFilter: filterOptions;  // Current value stored on the screen
    onFilterChange: (filter: filterOptions) => void;  // Function in order to update the parent
}

const BrewLogFilterSelector: React.FC<BrewLogFilterSelectorProps> = ({ selectedFilter, onFilterChange }) => {
    
    const filterOptions: brewLogFilter[] = [
        { id: 5, label: "all" },
        { id: 1, icon: require("./icons/pour_over.png"), label: "pour over" },
        { id: 2, icon: require("./icons/cold_brew.png"), label: "cold brew" },
        { id: 3, icon: require("./icons/brew_bar.png"), label: "brew bar" },
        { id: 4, icon: require("./icons/french_press.png"), label: "french press" },
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
    )
};

const styles = StyleSheet.create({
    container: {
        height: 80,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    buttonWrapper: {
        marginHorizontal: 8,
    },
});

export default BrewLogFilterSelector;