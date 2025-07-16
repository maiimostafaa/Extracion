import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Animated,
  Pressable,
  FlatList,
  Alert,
  TextInput,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import ShopItemCard from "../assets/components/shopItemCard";
import ShopFilterSelector from "../assets/components/ShopFilterSelector";
import { mockShopItems } from "../assets/mock_data/mock-shopItems";
import { ShopItem } from "../assets/types/shop-item";
import Header from "../navigation/Header";
import BannerCarousel from "../assets/components/bannerCarousel";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FilterOptions = "featured" | "beans" | "tools" | "gift cards";

const { width } = Dimensions.get("window");

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOptions>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate header sticky behavior
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const filteredData = useMemo(() => {
    let filtered = mockShopItems;
    console.log(filteredData);

    // Filter by category
    if (selectedFilter !== "featured") {
      filtered = filtered.filter((item) => item.category === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery]);

  const handleFilterChange = (newFilter: FilterOptions) => {
    setSelectedFilter(newFilter);
  };

  const handleItemPress = (item: ShopItem) => {
    navigation.navigate("ShopItemDetail", { item });
  };

  const handleCart = () => {
    // navigation.navigate("Cart");
  };

  const handleLiked = () => {
    // navigation.navigate("Liked");
  };

  const handleOrders = () => {
    // navigation.navigate("Orders");
  };

  const renderShopItem = ({ item }: { item: ShopItem }) => (
    <ShopItemCard item={item} onPress={() => handleItemPress(item)} />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <BannerCarousel />

      {/* Filter Selector */}
      <View style={styles.filterContainer}>
        <ShopFilterSelector
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>
        {selectedFilter === "featured" ? "new arrivals" : selectedFilter}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Sticky Header */}
      <SafeAreaView style={styles.stickyHeader}>
        <Header tintColor="#000" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <EvilIcons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={handleCart}>
            <Ionicons name="bag-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleLiked}>
            <Ionicons name="heart-outline" size={20} color="#58595B" />
            <Text style={styles.quickActionText}>liked</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleOrders}>
            <Ionicons name="receipt-outline" size={20} color="#58595B" />
            <Text style={styles.quickActionText}>orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {renderHeader()}

        {/* Shop Items Grid */}
        <View style={styles.itemsContainer}>
          <FlatList
            data={filteredData}
            renderItem={renderShopItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  stickyHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 30,
    zIndex: 1000,
    marginTop: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
    fontFamily: "cardRegular",
  },
  cartButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  quickAction: {
    alignItems: "center",
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#58595B",
  },
  quickActionText: {
    fontSize: 12,
    color: "#58595B",
    marginTop: 4,
    fontFamily: "cardRegular",
  },
  scrollView: {
    flex: 1,
  },
  headerContent: {
    paddingTop: 16,
    paddingBottom: 10,
  },
  filterContainer: {
    marginTop: -90,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 16,
    fontFamily: "cardRegular",
  },
  itemsContainer: {
    paddingBottom: 100,
  },
  itemsGrid: {
    paddingBottom: 20,
  },
  itemsRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
