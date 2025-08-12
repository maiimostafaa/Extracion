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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Header from "../../navigation/Header";
import BrewLogFilterButton from "../../assets/components/brew-log-components/brewLogFilterButton";
import { brewLogFilter } from "../../assets/types/BrewLog/brewLogFilter";
import BrewLogFilterSelector from "../../assets/components/brew-log-components/brewLogFilterSelector";
import BrewLogEntryCard from "../../assets/components/brew-log-components/brewLogEntryCard";
import {
  brewLogEntry,
  coffeeBeanDetail,
  brewDetail,
} from "../../assets/types/BrewLog/brewLogEntry";
import { loadBrewLogs } from "../../brewLogStorage";

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

  const allBrewLogEntries: brewLogEntry[] = [
    {
      id: 1,
      date: new Date("2024-06-15"),
      name: "Morning Espresso Blend",
      brewMethod: "Pour Over",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
      coffeeBeanDetail: {
        coffeeName: "Blue Mountain Premium",
        origin: "Jamaica",
        roasterDate: "2024-06-10",
        roasterLevel: "Medium",
        bagWeight: 250,
      },
      brewDetail: {
        grindSize: 7,
        beanWeight: 18,
        waterAmount: 36,
        ratio: 2,
        brewTime: 28,
        temperature: 93,
      },
      tasteRating: {
        Gritty: 0,
        Smooth: 3,
        Body: 2,
        Clean: 2,
        Fruity: 1,
        Floral: 0,
        Chocolate: 2,
        Nutty: 1,
        Caramel: 2,
        Roasted: 3,
        Cereal: 0,
        Green: 0,
        Sour: 0,
        Bitter: 1,
        Sweet: 2,
        Salty: 0,
      },
      rating: 2.5,
    },
    {
      id: 2,
      date: new Date("2024-06-25"),
      name: "Cold Brew Concentrate",
      brewMethod: "French Press",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
      coffeeBeanDetail: {
        coffeeName: "Guatemala Antigua",
        origin: "Guatemala",
        roasterDate: "2024-06-18",
        roasterLevel: "Dark",
        bagWeight: 500,
      },
      brewDetail: {
        grindSize: 20,
        beanWeight: 80,
        waterAmount: 640,
        ratio: 8,
        brewTime: 86400,
        temperature: 22,
      },
      tasteRating: {
        Gritty: 0,
        Smooth: 3,
        Body: 3,
        Clean: 1,
        Fruity: 0,
        Floral: 0,
        Chocolate: 3,
        Nutty: 2,
        Caramel: 1,
        Roasted: 2,
        Cereal: 1,
        Green: 0,
        Sour: 0,
        Bitter: 0,
        Sweet: 1,
        Salty: 0,
      },
      rating: 4.0,
    },
    {
      id: 3,
      date: new Date("2024-06-20"),
      name: "Ethiopian Pour Over",
      brewMethod: "Pour Over",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
      coffeeBeanDetail: {
        coffeeName: "Yirgacheffe Natural",
        origin: "Ethiopia",
        roasterDate: "2024-06-12",
        roasterLevel: "Light",
        bagWeight: 340,
      },
      brewDetail: {
        grindSize: 15,
        beanWeight: 22,
        waterAmount: 350,
        ratio: 16,
        brewTime: 240,
        temperature: 96,
      },
      tasteRating: {
        Gritty: 0,
        Smooth: 2,
        Body: 1,
        Clean: 3,
        Fruity: 3,
        Floral: 3,
        Chocolate: 0,
        Nutty: 0,
        Caramel: 1,
        Roasted: 1,
        Cereal: 0,
        Green: 0,
        Sour: 1,
        Bitter: 0,
        Sweet: 2,
        Salty: 0,
      },
      rating: 4.7,
    },
    {
      id: 4,
      date: new Date("2024-06-18"),
      name: "Cold Brew Summer",
      brewMethod: "Cold Brew",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
      coffeeBeanDetail: {
        coffeeName: "Brazilian Santos",
        origin: "Brazil",
        roasterDate: "2024-06-15",
        roasterLevel: "Medium",
        bagWeight: 250,
      },
      brewDetail: {
        grindSize: 22,
        beanWeight: 60,
        waterAmount: 480,
        ratio: 8,
        brewTime: 43200,
        temperature: 20,
      },
      tasteRating: {
        Gritty: 0,
        Smooth: 3,
        Body: 2,
        Clean: 2,
        Fruity: 1,
        Floral: 0,
        Chocolate: 1,
        Nutty: 2,
        Caramel: 2,
        Roasted: 1,
        Cereal: 0,
        Green: 0,
        Sour: 0,
        Bitter: 0,
        Sweet: 2,
        Salty: 0,
      },
      rating: 3.8,
    },
  ];

  // Testing brew log's peristent store
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

  const [allBrewLogEntriesTest, setAllBrewLogEntriesTest] = useState<
    brewLogEntry[]
  >([]);

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
    image:
      "../../assets/nonclickable-visual-elements/brewLog/BrewLogEditScreenPlaceholderInstruction.png",
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
  header: {
    padding: 16,
  },
  filterOptionContainer: {
    marginTop: "-4%",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  // FlatList Grid Styles
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

  // Floating Action Button
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
