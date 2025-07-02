import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { brewLogFilter } from "../../types/BrewLog/brewLogFilter";

interface brewLogFilterButtonProps {
    brewLogFilter: brewLogFilter;
    onPress: () => void; // Function passed down to set the state in brewlog.tsx view
    isSelected: boolean; // Informs the button to change its look if the view has the current option selected
}

const BrewLogFilterButton: React.FC<brewLogFilterButtonProps> = ({ brewLogFilter, onPress, isSelected }) => {
    const icon = brewLogFilter.icon;
    const words = brewLogFilter.label.split(" ");

    const displayText = words.length === 1
        ? words[0] // Single word - no line break
        : `${words[0]}\n${words.slice(1).join(" ")}`;

    return (
        <TouchableOpacity 
            style={[styles.container, isSelected && styles.containerSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && (
                <Image
                    source={icon}
                    style={[styles.icon, isSelected && styles.iconSelected]}
                />
            )}
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {displayText}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#58595B",
        borderRadius: 10,
    },
    icon: {
        width: 15,
        height: 20,
        borderRadius: 2,
        tintColor: "#58595B",
    },
    label: {
        textAlign: "center",
        color: "#58595B",
        fontSize: 10,
        fontWeight: "500",
    },
    containerSelected: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8CDBED",
        borderColor: "#8CDBED"
    },
    iconSelected: {
        width: 15,
        height: 20,
        borderRadius: 2,
        tintColor: "#FFFFFF",
    },
    labelSelected: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "500",
    },
});

export default BrewLogFilterButton;