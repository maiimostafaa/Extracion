import React, { useState, useEffect, useRef, useMemo } from "react";
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
import BrewLogFilterButton from "../../assets/components/brewLogComponents/brewLogFilterButton";
import { brewLogFilter } from "../../assets/types/BrewLog/brewLogFilter";
import BrewLogFilterSelector from "../../assets/components/brewLogComponents/brewLogFilterSelector";
import BrewLogEntryCard from "../../assets//components/brewLogComponents/brewLogEntryCard";
import {
  brewLogEntry,
  coffeeBeanDetail,
  brewDetail,
} from "../../assets/types/BrewLog/brewLogEntry";

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

  // Filtering Data
  const filteredData = useMemo(() => {
    if (selectedFilter === "All") {
      return allBrewLogEntries;
    }

    return allBrewLogEntries.filter(
      (entry) => entry.brewMethod === selectedFilter
    );
  }, [selectedFilter, allBrewLogEntries]);

  const handleFilterChange = (newFilter: filterOptions) => {
    setSelectedFilter(newFilter);
  };

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
    paddingHorizontal: 8, // Reduced padding since cards have their own spacing
    paddingTop: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between", // Distributes cards evenly across the row
    paddingHorizontal: 8,
  },
  cardWrapper: {
    flex: 0.48, // Each card takes ~48% of row width (with gap between)
    marginBottom: 16, // Vertical spacing between rows
  },
  separator: {
    height: 8, // Additional vertical spacing between rows
  },
});
