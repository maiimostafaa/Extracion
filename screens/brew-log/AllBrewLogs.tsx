/**
 * AllBrewLogs.tsx
 * 
 * The screen that holds all the brew logs and enables the users to view and tap on them to learn more or to edit.
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  brewLogEntry,
  coffeeBeanDetail,
  brewDetail,
} from "../../assets/types/brew-log/brew-log-entry";
import { brewLogFilter } from "../../assets/types/brew-log/brew-log-filter";
import { loadBrewLogs } from "../../assets/local-storage/brewLogStorage";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Header from "../../navigation/Header";
import BrewLogFilterButton from "../../assets/components/brew-log-components/filter-button";
import BrewLogFilterSelector from "../../assets/components/brew-log-components/filter-selector";
import BrewLogEntryCard from "../../assets/components/brew-log-components/entry-card";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type filterOptions =
  | "All"
  | "Pour Over"
  | "Cold Brew"
  | "Brew Bar"
  | "French Press";

const { width } = Dimensions.get("window");

export default function BrewLogScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Mental note: This is similar to @State in SwiftUI
  const [selectedFilter, setSelectedFilter] = useState<filterOptions>("All");

  // Brew log data from persistent store
  const [allBrewLogEntriesTest, setAllBrewLogEntriesTest] = useState<
    brewLogEntry[]
  >([]);

  // Fetches from permanent store every time the screen is shown (not mounted)
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const logs = await loadBrewLogs();
        if (isActive) {
          setAllBrewLogEntriesTest(logs);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Filtering Data
  const filteredData = useMemo(() => {
    if (selectedFilter === "All") {
      return allBrewLogEntriesTest; // Use data from permanent storage, not mock data
    }

    return allBrewLogEntriesTest.filter(
      (entry) => entry.brewMethod === selectedFilter
    );
  }, [selectedFilter, allBrewLogEntriesTest]);

  const handleFilterChange = (newFilter: filterOptions) => {
    setSelectedFilter(newFilter);
  };

  // Create a default empty brew log entry for new entries
  const createNewBrewLogEntry = (): brewLogEntry => ({
    id: Date.now(), // Temporary ID - will be replaced when saving
    date: new Date(),
    name: "New Brew Log",
    brewMethod: "Pour Over",
    image: "../../assets/graphics/brew-log/brew-log-placeholder.png",
    coffeeBeanDetail: {
      coffeeName: "",
      origin: "",
      roasterDate: "",
      roasterLevel: "Medium",
      bagWeight: 0,
    },
    brewDetail: {
      grindSize: 0,
      beanWeight: 0,
      waterAmount: 0,
      ratio: 0,
      brewTime: 0,
      temperature: 0,
    },
    tasteRating: {
      Gritty: 0,
      Smooth: 0,
      Body: 0,
      Clean: 0,
      Fruity: 0,
      Floral: 0,
      Chocolate: 0,
      Nutty: 0,
      Caramel: 0,
      Roasted: 0,
      Cereal: 0,
      Green: 0,
      Sour: 0,
      Bitter: 0,
      Sweet: 0,
      Salty: 0,
    },
    rating: 0,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header tintColor="#58595B" />
      </View>

      {/* Filter Options */}
      <View style={styles.filterOptionContainer}>
        <BrewLogFilterSelector
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
      </View>

      {/* Scrollable Grid */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <BrewLogEntryCard brewLogEntry={item} />
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Handle duplicate IDs
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("BrewLogEditScreen", {
            brewLogEntry: createNewBrewLogEntry(),
          })
        }
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={50} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Background and container styles (top-level)
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    width: width,
    backgroundColor: "#F5F5F5",
    marginTop: "10%",
  },
  
  // Header section (top of screen)
  header: {
    padding: 16,
  },
  
  // Filter section (below header)
  filterOptionContainer: {
    marginTop: "-4%",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  // FlatList Grid Styles (main content area)
  flatListContent: {
    paddingHorizontal: 18, // 18px from left and right sides
    paddingTop: 24, // Small gap between filter buttons and cards, matching Figma
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between", // Distributes cards evenly across the row
    gap: 25, // 25px gap between columns
  },
  cardWrapper: {
    flex: 1, // Each card takes equal width
    maxWidth: (width - 36 - 25) / 2, // Calculate card width: (screen width - left/right padding - gap) / 2
    marginBottom: 16, // Vertical spacing between rows
  },
  separator: {
    height: 8, // Additional vertical spacing between rows
  },

  // Floating Action Button (bottom-right overlay)
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#8CDBED",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
});
