import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { brewLogEntry } from "../../assets/types/brew-log/brew-log-entry";
import TastingWheel from "../../assets/components/brew-log-components/tastingWheel";
import BrewLogBrewDataBlock from "../../assets/components/brew-log-components/brewDataBlock";
import BrewLogRatingStars from "../../assets/components/brew-log-components/editableStarRating";
import { loadBrewLogs } from "../../assets/local-storage/brewLogStorage";

type DetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "BrewLogDetailScreen"
>;
type DetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BrewLogDetailScreen"
>;

const BrewLogDetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();

  // Get initial brewLogEntry from route params
  const initialBrewLogEntry = route.params?.brewLogEntry;

  // State to hold the current brew log entry (will be updated when screen comes into focus)
  const [currentBrewLogEntry, setCurrentBrewLogEntry] = useState<
    brewLogEntry | undefined
  >(initialBrewLogEntry);

  // Get brewing method icon
  const getBrewMethodIcon = (brewMethod: string) => {
    switch (brewMethod) {
      case "French Press":
        return require("../../assets/graphics/brewing-methods/french-press.png");
      case "Pour Over":
        return require("../../assets/graphics/brewing-methods/pour-over.png");
      case "Cold Brew":
        return require("../../assets/graphics/brewing-methods/cold-brew.png");
      case "Brew Bar":
        return require("../../assets/graphics/brewing-methods/brew-bar.png");
      default:
        return require("../../assets/graphics/brewing-methods/pour-over.png");
    }
  };

  // Reload brew log data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const reloadBrewLogData = async () => {
        if (initialBrewLogEntry) {
          try {
            const allLogs = await loadBrewLogs();
            const updatedEntry = allLogs.find(
              (log) => log.id === initialBrewLogEntry.id
            );
            if (updatedEntry) {
              setCurrentBrewLogEntry(updatedEntry);
            } else {
              // If entry not found, use the initial entry (might be a new unsaved entry)
              setCurrentBrewLogEntry(initialBrewLogEntry);
            }
          } catch (error) {
            console.error("Error reloading brew log data:", error);
            // Fallback to initial data on error
            setCurrentBrewLogEntry(initialBrewLogEntry);
          }
        }
      };

      reloadBrewLogData();
    }, [initialBrewLogEntry])
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBrewTime = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    }
    return `${seconds}s`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    if (currentBrewLogEntry) {
      navigation.navigate("BrewLogEditScreen", {
        brewLogEntry: currentBrewLogEntry,
      });
    }
  };

  // Early return if no brew log entry
  if (!currentBrewLogEntry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Brew Logs</Text>
          </View>
          <View style={styles.editButton} />
        </View>
        <View style={styles.scrollView}>
          <Text style={styles.value}>No brew log data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back and Edit buttons */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Brew Logs</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Date and Brew Method with Icon */}
        <View style={styles.dateBrewMethodContainer}>
          <View style={styles.dateBrewMethodContent}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {formatDate(currentBrewLogEntry.date)}
              </Text>
            </View>
            <View style={styles.drinkNameContainer}>
              <Image
                source={getBrewMethodIcon(currentBrewLogEntry.brewMethod)}
                style={styles.brewMethodIcon}
                resizeMode="contain"
              />
              <Text style={styles.drinkNameText}>
                {currentBrewLogEntry.brewMethod}
              </Text>
            </View>
          </View>
        </View>

        {/* Brew Log Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              currentBrewLogEntry.image.startsWith("http")
                ? { uri: currentBrewLogEntry.image }
                : currentBrewLogEntry.image.includes("brew-log-placeholder.png")
                  ? require("../../assets/graphics/brew-log/brew-log-placeholder.png")
                  : { uri: currentBrewLogEntry.image }
            }
            style={styles.brewImage}
          />
        </View>

        {/* GENERAL SECTION - Coffee bean information */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coffee Name</Text>
          <Text style={styles.value}>
            {currentBrewLogEntry.coffeeBeanDetail.coffeeName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Region</Text>
          <Text style={styles.value}>
            {currentBrewLogEntry.coffeeBeanDetail.origin}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roast Date</Text>
          <Text style={styles.value}>
            {currentBrewLogEntry.coffeeBeanDetail.roasterDate}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roast Level</Text>
          <Text style={styles.value}>
            {currentBrewLogEntry.coffeeBeanDetail.roasterLevel}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bag Weight (g)</Text>
          <Text style={styles.value}>
            {currentBrewLogEntry.coffeeBeanDetail.bagWeight}g
          </Text>
        </View>

        {/* BREW DATA SECTION - Brewing parameters */}
        <Text style={styles.sectionTitle}>Brew Data</Text>
        <View style={styles.brewDataGrid}>
          <View style={styles.gridRow}>
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/coffee-bean.png")}
              title="Grind Size"
              value={currentBrewLogEntry.brewDetail.grindSize}
              valueColor="white"
            />
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/coffee-bean.png")}
              title="Weight (g)"
              value={currentBrewLogEntry.brewDetail.beanWeight}
              valueColor="white"
              // unit="g"
            />
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/water-drop.png")}
              title="Water (ml)"
              value={currentBrewLogEntry.brewDetail.waterAmount}
              valueColor="white"
              // unit="ml"
            />
          </View>
          <View style={styles.gridRow}>
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/scale.png")}
              title="Ratio"
              value={
                currentBrewLogEntry.brewDetail.ratio
                  ? `1:${currentBrewLogEntry.brewDetail.ratio}`
                  : ""
              }
              valueColor="white"
            />
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/clock.png")}
              title="Brew Time"
              value={
                currentBrewLogEntry.brewDetail.brewTime
                  ? formatBrewTime(currentBrewLogEntry.brewDetail.brewTime)
                  : ""
              }
              valueColor="white"
            />
            <BrewLogBrewDataBlock
              iconPath={require("../../assets/graphics/brew-log/thermometer.png")}
              title="Temperature"
              value={currentBrewLogEntry.brewDetail.temperature}
              valueColor="white"
              // unit="°C"
            />
          </View>
        </View>

        {/* TASTING WHEEL SECTION - All taste profiles */}
        <Text style={styles.sectionTitle}>Tasting Wheel</Text>
        <TastingWheel tasteRating={currentBrewLogEntry.tasteRating} />

        {/* OVERALL RATING SECTION - Star rating */}
        <Text style={styles.sectionTitle}>Overall Rating</Text>
        <BrewLogRatingStars
          rating={currentBrewLogEntry.rating}
          key={`rating-${currentBrewLogEntry.rating}-${currentBrewLogEntry.id}`}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333", // Match header background to extend to top
    ...Platform.select({
      android: {
        marginTop: "10%",
      },
      // iOS doesn't get the marginTop
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced from 12 to 8 for thinner header
    backgroundColor: "#333333",
    borderBottomWidth: 0.5, // Thinner border like iOS
    borderBottomColor: "#444444",
    height: 50, // Fixed height like iOS navigation bar
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 6, // Reduced padding
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44, // Maintain minimum touch target size
    minHeight: 44,
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 20, // Lach: Adjusted to try and match Figma mockup's size
    fontWeight: "600",
    color: "white",
    marginLeft: 8, // Add some space after the back button
    fontFamily: "cardRegular",
  },
  editButton: {
    paddingVertical: 6, // Reduced padding to match back button
    paddingHorizontal: 8, // Reduced padding
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
  },
  editButtonText: {
    fontSize: 17, // Match iOS standard button text size
    color: "#8CDBED", // App's accent color instead of iOS blue
    fontWeight: "400", // Slightly lighter weight for iOS style
    fontFamily: "cardRegular",
  },
  scrollView: {
    flex: 1,
    padding: 22,
    backgroundColor: "#58595B", // Original content background color
  },
  dateBrewMethodContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dateBrewMethodContent: {
    alignItems: "center",
  },
  dateContainer: {
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: "white",
    fontWeight: "400",
    fontFamily: "cardRegular",
  },
  drinkNameContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  brewMethodIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
    resizeMode: "contain",
    marginRight: 8,
  },
  drinkNameText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    fontFamily: "cardRegular",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 20,
  },
  brewImage: {
    width: 216,
    height: 216,
    borderRadius: 10,
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    fontFamily: "cardRegular",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400", // 400 for normal / regular font weight
    color: "#8CDBED",
    marginBottom: 16,
    marginTop: 28,
    letterSpacing: 1.0,
    textAlign: "left",
    fontFamily: "cardRegular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
  },
  label: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
    flex: 1,
    fontFamily: "cardRegular",
  },
  value: {
    fontSize: 14,
    color: "white",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
    fontFamily: "cardRegular",
  },
  brewDataGrid: {
    marginBottom: 0,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Changed from "space-between" to give more even spacing
    marginBottom: 12,
    gap: 0, // No need to add a gap between items as the current padding and margins in individual info blocks is sufficient
  },
});

export default BrewLogDetailScreen;
