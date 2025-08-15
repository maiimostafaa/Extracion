/**
 * brew-data-block.tsx
 * 
 * A reusable component that displays brewing parameter data with an icon, title, and value in a styled block format.
 * This component is used in both the brewlog edit and view pages.
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface brewLogBrewDataBlockProps {
  iconPath: any; // Image source (require() result or URI)
  title: string;
  value: string | number;
  unit?: string; // Optional unit like "g", "ml", "°C", etc.
  valueColor?: string; // Optional color for the value text
}

const BrewLogBrewDataBlock: React.FC<brewLogBrewDataBlockProps> = ({
  iconPath,
  title,
  value,
  unit = "",
  valueColor = "#8CDBED",
}) => {
  const displayValue = value || "enter value";
  const isPlaceholder = !value || value === 0 || value === "0";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={iconPath} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={[styles.value, isPlaceholder && styles.placeholderValue, { color: isPlaceholder ? "#999999" : valueColor }]}>
        {displayValue}{unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container (overall block layout)
  container: {
    flex: 1,
    borderRadius: 8,
    padding: 12, // Reduced padding slightly to give more space for text
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    margin: 2,
    minWidth: 100, // Add minimum width to prevent over-shrinking
  },
  
  // Icon section (top of component)
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    width: 36,
    height: 36,
    tintColor: "#FFFFFF",
  },
  
  // Title section (middle of component)
  title: {
    fontSize: 14,
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    fontFamily: 'cardRegular',
  },
  
  // Value section (bottom of component)
  value: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: 'cardRegular',
    // Color will be set dynamically via props depending on whether it is in edit state or not
  },
  placeholderValue: {
    color: "#999999",
    fontStyle: "italic",
    fontSize: 14,
  },
});

export default BrewLogBrewDataBlock;
