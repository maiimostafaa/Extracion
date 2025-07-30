import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { brewLogEntry } from "../../assets/types/BrewLog/brewLogEntry";
import TastingWheel from "../../assets/components/brewLogComponents/TastingWheel";
import { loadBrewLogs } from "../../brewLogStorage";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "BrewLogDetailScreen">;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "BrewLogDetailScreen">;

const BrewLogDetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  
  // Get initial brewLogEntry from route params
  const initialBrewLogEntry = route.params?.brewLogEntry;
  
  // State to hold the current brew log entry (will be updated when screen comes into focus)
  const [currentBrewLogEntry, setCurrentBrewLogEntry] = useState<brewLogEntry | undefined>(initialBrewLogEntry);

  // Reload brew log data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const reloadBrewLogData = async () => {
        if (initialBrewLogEntry) {
          try {
            const allLogs = await loadBrewLogs();
            const updatedEntry = allLogs.find(log => log.id === initialBrewLogEntry.id);
            if (updatedEntry) {
              setCurrentBrewLogEntry(updatedEntry);
            } else {
              // If entry not found, use the initial entry (might be a new unsaved entry)
              setCurrentBrewLogEntry(initialBrewLogEntry);
            }
          } catch (error) {
            console.error('Error reloading brew log data:', error);
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
      navigation.navigate('BrewLogEditScreen', { brewLogEntry: currentBrewLogEntry });
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
        
        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(currentBrewLogEntry.date)}</Text>
        </View>
        
        {/* Drink Name */}
        <View style={styles.drinkNameContainer}>
          <Text style={styles.drinkNameText}>{currentBrewLogEntry.name}</Text>
        </View>
        
        {/* Brew Log Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentBrewLogEntry.image }}
            style={styles.brewImage}
          />
        </View>
        
        {/* Header Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>#{currentBrewLogEntry.id}</Text>
        </View>

        {/* GENERAL SECTION - Coffee bean information */}
        <Text style={styles.sectionTitle}>general</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coffee Name:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.coffeeBeanDetail.coffeeName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Origin:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.coffeeBeanDetail.origin}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roaster Date:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.coffeeBeanDetail.roasterDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roaster Level:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.coffeeBeanDetail.roasterLevel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bag Weight:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.coffeeBeanDetail.bagWeight}g</Text>
        </View>

        {/* BREW DATA SECTION - Brewing parameters */}
        <Text style={styles.sectionTitle}>brew data</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Grind Size:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.brewDetail.grindSize}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coffee (Weight):</Text>
          <Text style={styles.value}>{currentBrewLogEntry.brewDetail.beanWeight}g</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Water (Weight):</Text>
          <Text style={styles.value}>{currentBrewLogEntry.brewDetail.waterAmount}ml</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ratio:</Text>
          <Text style={styles.value}>1:{currentBrewLogEntry.brewDetail.ratio}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{formatBrewTime(currentBrewLogEntry.brewDetail.brewTime)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Temperature:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.brewDetail.temperature}°C</Text>
        </View>

        {/* TASTING WHEEL SECTION - All taste profiles */}
        <Text style={styles.sectionTitle}>tasting wheel</Text>
        <TastingWheel tasteRating={currentBrewLogEntry.tasteRating} />

        {/* OVERALL RATING SECTION - Final rating */}
        <Text style={styles.sectionTitle}>overall rating</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>{currentBrewLogEntry.rating}/5</Text>
        </View>
        
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333", // Match header background to extend to top
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
    fontSize: 17, // iOS standard navigation title size
    fontWeight: "600",
    color: "white",
    marginLeft: 8, // Add some space after the back button
    fontFamily: 'cardRegular',
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
    fontFamily: 'cardRegular',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: "#58595B", // Original content background color
  },
  dateContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  drinkNameContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  drinkNameText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  brewImage: {
    width: 150,
    height: 150,
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
    fontFamily: 'cardRegular',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#8CDBED",
    marginBottom: 16,
    marginTop: 24,
    letterSpacing: 1.2,
    textAlign: "left",
    fontFamily: 'cardRegular',
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
  },
  label: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    flex: 1,
    fontFamily: 'cardRegular',
  },
  value: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
    fontFamily: 'cardRegular',
  },
});

export default BrewLogDetailScreen;
