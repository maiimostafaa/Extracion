import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FilterOptions = "featured" | "beans" | "tools" | "gift cards";

interface ShopFilterSelectorProps {
  selectedFilter: FilterOptions;
  onFilterChange: (filter: FilterOptions) => void;
}

const filterOptions: {
  key: FilterOptions;
  label: string;
  icon: "star" | "gift" | any;
}[] = [
  { key: "featured", label: "featured", icon: "star" },
  { key: "beans", label: "beans", icon: require("../icons/bean.png") },
  { key: "tools", label: "tools", icon: require("../icons/tool.png") },
  { key: "gift cards", label: "gift cards", icon: "gift" },
];

export default function ShopFilterSelector({
  selectedFilter,
  onFilterChange,
}: ShopFilterSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.filterButton,
            selectedFilter === option.key && styles.selectedFilter,
          ]}
          onPress={() => onFilterChange(option.key)}
        >
          {/* Render Ionicons or Image based on the type of icon */}
          {typeof option.icon === "string" ? (
            <Ionicons
              name={option.icon as keyof typeof Ionicons.glyphMap} // Ensures type safety
              size={18}
              color={selectedFilter === option.key ? "#fff" : "#666"}
              style={styles.icon}
            />
          ) : (
            <Image
              source={option.icon}
              style={[
                styles.imageIcon,
                { tintColor: selectedFilter === option.key ? "#fff" : "#666" },
              ]}
            />
          )}
          <Text
            style={[
              styles.filterText,
              selectedFilter === option.key && styles.selectedFilterText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedFilter: {
    backgroundColor: "#8CDBED",
    borderColor: "#8CDBED",
  },
  icon: {
    marginRight: 6,
    resizeMode: "contain",
  },
  imageIcon: {
    width: 20,
    height: 18,
    marginRight: 6,
    resizeMode: "contain",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "main",
    fontWeight: "500",
  },
  selectedFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
});
