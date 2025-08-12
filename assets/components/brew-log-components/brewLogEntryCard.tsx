import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { brewLogEntry } from "../../types/BrewLog/brewLogEntry";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/AppNavigator";
import StarRating from "./StarRating";

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
            : brewLogEntry.image.includes(
                  "BrewLogEditScreenPlaceholderInstruction.png"
                )
              ? require("../../nonclickable-visual-elements/brewLog/BrewLogEditScreenPlaceholderInstruction.png")
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
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../icons/brew-log.png")}
                style={{ tintColor: "#078CC9", width: 32, height: 32 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 190 / 300,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    overflow: "hidden", // Prevent content from spilling out
  },
  image: {
    width: "100%",
    height: "55%", // Use percentage of container height instead of aspect ratio
    borderRadius: 8,
    maxWidth: 160,
    alignSelf: "center",
  },
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
  ratingContainer: {
    marginVertical: 0,
  },
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
  editButtonWrapper: {
    zIndex: 1,
  },
  iconButton: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: 40,
    height: 50,
  },
  iconText: {
    fontSize: 18,
  },
});

export default BrewLogEntryCard;
