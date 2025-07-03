import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { brewLogEntry } from "../../assets/types/BrewLog/brewLogEntry";

type EditScreenRouteProp = RouteProp<RootStackParamList, "BrewLogEditScreen">;
type EditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "BrewLogEditScreen">;

interface BrewLogEditScreenProps {
  brewLogEntry: brewLogEntry;
}

const BrewLogEditScreen: React.FC = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<EditScreenNavigationProp>();
  
  // Get brewLogEntry from route params - it's always required
  const brewLogEntry = route.params.brewLogEntry;

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

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Brew Log</Text>
          <Text style={styles.subtitle}>#{brewLogEntry.id}</Text>
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{brewLogEntry.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Method:</Text>
            <Text style={styles.value}>{brewLogEntry.brewMethod}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(brewLogEntry.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rating:</Text>
            <Text style={styles.value}>{brewLogEntry.rating}/5</Text>
          </View>
        </View>

        {/* Coffee Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coffee Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Coffee:</Text>
            <Text style={styles.value}>{brewLogEntry.coffeeBeanDetail.coffeeName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Origin:</Text>
            <Text style={styles.value}>{brewLogEntry.coffeeBeanDetail.origin}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Roast Level:</Text>
            <Text style={styles.value}>{brewLogEntry.coffeeBeanDetail.roasterLevel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bag Weight:</Text>
            <Text style={styles.value}>{brewLogEntry.coffeeBeanDetail.bagWeight}g</Text>
          </View>
        </View>

        {/* Brew Parameters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brew Parameters</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Grind Size:</Text>
            <Text style={styles.value}>{brewLogEntry.brewDetail.grindSize}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bean Weight:</Text>
            <Text style={styles.value}>{brewLogEntry.brewDetail.beanWeight}g</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Water Amount:</Text>
            <Text style={styles.value}>{brewLogEntry.brewDetail.waterAmount}ml</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ratio:</Text>
            <Text style={styles.value}>1:{brewLogEntry.brewDetail.ratio}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Brew Time:</Text>
            <Text style={styles.value}>{formatBrewTime(brewLogEntry.brewDetail.brewTime)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Temperature:</Text>
            <Text style={styles.value}>{brewLogEntry.brewDetail.temperature}°C</Text>
          </View>
        </View>

        {/* Taste Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taste Profile</Text>
          <View style={styles.tasteGrid}>
            {Object.entries(brewLogEntry.tasteRating).map(([taste, rating]) => (
              rating > 0 && (
                <View key={taste} style={styles.tasteItem}>
                  <Text style={styles.tasteLabel}>{taste}</Text>
                  <Text style={styles.tasteValue}>{rating}/3</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Details</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
  },
  tasteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tasteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "48%",
    marginBottom: 8,
    paddingVertical: 4,
  },
  tasteLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  tasteValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#8CDBED",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});

export default BrewLogEditScreen;