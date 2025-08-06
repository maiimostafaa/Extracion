import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface brewLogBrewDataBlockProps {
  iconPath: any; // Image source (require() result or URI)
  title: string;
  value: string | number;
  unit?: string; // Optional unit like "g", "ml", "°C", etc.
}

const BrewLogBrewDataBlock: React.FC<brewLogBrewDataBlockProps> = ({
  iconPath,
  title,
  value,
  unit = "",
}) => {
  const displayValue = value || "enter value";
  const isPlaceholder = !value || value === 0 || value === "0";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={iconPath} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={[styles.value, isPlaceholder && styles.placeholderValue]}>
        {displayValue}{unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#666666",
    borderRadius: 8,
    padding: 12, // Reduced padding slightly to give more space for text
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    margin: 2, // Reduced margin to give more width to each block
    minWidth: 100, // Add minimum width to prevent over-shrinking
  },
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    width: 36,
    height: 36,
    tintColor: "#FFFFFF",
  },
  title: {
    fontSize: 14,
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    fontFamily: 'cardRegular',
  },
  value: {
    fontSize: 14,
    color: "#8CDBED",
    fontWeight: "500",
    textAlign: "center",
    fontFamily: 'cardRegular',
  },
  placeholderValue: {
    color: "#999999",
    fontStyle: "italic",
    fontSize: 14,
  },
});

export default BrewLogBrewDataBlock;
