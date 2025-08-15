/**
 * entry-card.tsx
 * 
 * A card component that displays brew log entry information with navigation to detail and edit screens.
 */

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { brewLogEntry } from "../../types/brew-log/brew-log-entry";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import StarRating from "./card-star-rating";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface brewLogEntryCardProps {
  brewLogEntry: brewLogEntry;
}

const BrewLogEntryCard: React.FC<brewLogEntryCardProps> = ({
  brewLogEntry,
}) => {
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const navigation = useNavigation<NavigationProp>();

  const handleCardPress = () => {
    console.log("Card pressed for:", brewLogEntry.name);
    navigation.navigate("BrewLogDetailScreen", { brewLogEntry });
  };

  const handleEditPress = () => {
    console.log("Edit pressed for:", brewLogEntry.name);
    navigation.navigate("BrewLogEditScreen", { brewLogEntry });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.95}
    >
      <Image
        source={
          brewLogEntry.image.startsWith("http")
            ? { uri: brewLogEntry.image }
            : brewLogEntry.image.includes("brew-log-placeholder.png")
              ? require("../../graphics/brew-log/brew-log-placeholder.png")
              : { uri: brewLogEntry.image }
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <View style={styles.textSection}>
          <Text style={styles.nameText} numberOfLines={2}>
            {brewLogEntry.name}
          </Text>
          <Text style={styles.brewMethodText} numberOfLines={1}>
            {brewLogEntry.brewMethod}
          </Text>

          {/* Star rating */}
          <View style={styles.ratingContainer}>
            <StarRating
              rating={brewLogEntry.rating}
              size={12}
              color="#078CC9"
              outlineColor="#E0E0E0"
            />
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.dateText}>
            {formatDate(new Date(brewLogEntry.date))}
          </Text>

          <View style={styles.editButtonWrapper}>
            <Feather
              name={"edit"}
              size={30}
              style={styles.iconButton}
              onPress={handleEditPress}
              color={"#078CC9"}
              activeOpacity={0.7}
            ></Feather>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Main container (overall card layout)
  container: {
    width: "100%",
    aspectRatio: 190 / 300,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    overflow: "hidden", // Prevent content from spilling out
  },
  
  // Image section (top of card)
  image: {
    width: "100%",
    height: "55%", // Use percentage of container height instead of aspect ratio
    borderRadius: 8,
    maxWidth: 160,
    alignSelf: "center",
  },
  
  // Content section (below image)
  contentContainer: {
    height: "40%", // Fixed height for content area
    marginTop: 8,
    justifyContent: "space-between",
  },
  textSection: {
    flex: 1,
    minHeight: 0, // Allow text section to shrink if needed
  },
  nameText: {
    fontSize: 16,
    fontFamily: "cardRegular",
    color: "#078CC9",
    lineHeight: 18,
    marginBottom: 2,
  },
  brewMethodText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 14,
    marginVertical: 4,
    fontFamily: "cardRegular",
  },
  
  // Rating section (middle of content)
  ratingContainer: {
    marginVertical: 0,
  },
  
  // Bottom section (date and edit button)
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 20, // Fixed height for bottom row
    flexShrink: 0, // Don't let this shrink
  },
  dateText: {
    marginTop: 5,
    fontSize: 12,
    color: "#888",
    fontFamily: "cardRegular",
    lineHeight: 22,
  },
  
  // Edit button (bottom-right)
  editButtonWrapper: {
    zIndex: 1,
  },
  iconButton: {
    resizeMode: "contain",
    marginTop: -10,
  },
  iconText: {
    fontSize: 18,
  },
});

export default BrewLogEntryCard;
