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
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../navigation/AppNavigator";
import Header from "../navigation/Header";
import NewsletterCard from "../assets/components/newsletter";
import HomePageFilterSelector from "../assets/components/HomePageFilterSelector";
import mockNewsletters from "../assets/mock_data/mock-newsletter-items";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type filterOptions = "all" | "coffee recipe" | "KOL featuring" | "promotion";

const { width } = Dimensions.get("window");
const frames = [
  require("../assets/vaaka-animation/1.png"),
  require("../assets/vaaka-animation/2.png"),
  require("../assets/vaaka-animation/3.png"),
  require("../assets/vaaka-animation/4.png"),
  require("../assets/vaaka-animation/5.png"),
  require("../assets/vaaka-animation/6.png"),
  require("../assets/vaaka-animation/7.png"),
  require("../assets/vaaka-animation/8.png"),
  require("../assets/vaaka-animation/9.png"),
  require("../assets/vaaka-animation/10.png"),
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [animationFrame, setAnimationFrame] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<filterOptions>("all");

  // Calculate when header should collapse to just show Header component
  const headerScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.5], // Scale down to 50% of original height
    extrapolate: "clamp",
  });

  // Fade out the greeting and points when collapsing
  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Move the greeting content up when collapsing
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  const onRefresh = () => {
    setRefreshing(true);
    let frame = 0;
    const interval = setInterval(() => {
      setAnimationFrame((prev) => {
        frame = (prev + 1) % frames.length;
        return frame;
      });
    }, 80); // 80ms per frame

    setTimeout(() => {
      clearInterval(interval);
      setRefreshing(false);
      setAnimationFrame(0); // reset to first frame
    }, 1000); // total animation duration
  };

  const filteredData = useMemo(() => {
    if (selectedFilter === "all") {
      return mockNewsletters;
    }

    return mockNewsletters.filter((entry) => entry.category === selectedFilter);
  }, [selectedFilter, mockNewsletters]);

  const handleFilterChange = (newFilter: filterOptions) => {
    setSelectedFilter(newFilter);
  };

  const handleWallet = () => {
    navigation.navigate("Wallet");
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0, 2]} // Make header and filter sticky
      >
        {/* Collapsible Sticky Header */}
        <Animated.View
          style={[
            styles.header,
            { transform: [{ scaleY: headerScale }], zIndex: 1000 },
          ]}
        >
          <Image source={frames[animationFrame]} style={styles.headerImage} />
          <View style={styles.overlayContent}>
            <SafeAreaView
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1001,
              }}
            >
              <Header tintColor="#fff" />
            </SafeAreaView>
            <Animated.View
              style={[
                styles.textOverlayContainer,
                {
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }],
                },
              ]}
            >
              <Text style={styles.greeting}>Hello Miss Wong</Text>
              <View style={styles.pointsContainer}>
                <View style={styles.border}>
                  <Text style={styles.points}>
                    Points{" "}
                    <Text style={{ fontWeight: "600", fontFamily: "default" }}>
                      23{"    "}
                    </Text>
                  </Text>
                </View>

                <EvilIcons
                  name="search"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 12 }}
                  onPress={() => navigation.navigate("SearchScreen")}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Horizontal Scroll Content */}
        <View style={styles.scrollContent}>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: "#f5f5f5",
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <TouchableOpacity>
              <ImageBackground
                source={require("../assets/backgrounds/barista-classes-bg.png")}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground
                source={require("../assets/backgrounds/cafe-finder-bg.png")}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground
                source={require("../assets/backgrounds/cafe-event-bg.png")}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Sticky Filter */}
        <View style={styles.filterContainer}>
          <HomePageFilterSelector
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        </View>

        {/* Newsletter Cards */}
        <View style={styles.newsletterContainer}>
          {filteredData.map((item) => (
            <NewsletterCard
              key={item.id}
              item={item}
              onPress={() => console.log("Go to:", item.id)}
            />
          ))}
        </View>
      </Animated.ScrollView>

      {/* Floating Wallet Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Wallet")}
      >
        <Ionicons name="wallet-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  filterContainer: {
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    width: "100%",
    height: 200, // Set a fixed height instead of dynamic
    overflow: "hidden",
    backgroundColor: "#eee",
    borderBottomLeftRadius: 40,
    zIndex: 1000,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlayContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    height: "100%",
  },
  textOverlayContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  pointsContainer: {
    flexDirection: "row",
  },
  greeting: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 8,
    fontFamily: "main",
  },
  points: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "main",
  },
  border: {
    borderRightWidth: 1,
    borderColor: "#fff",
  },
  scrollContent: {
    backgroundColor: "#fff",
  },
  newsletterContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    width: "100%",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8CDBED",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  imageContainer: {
    width: 200,
    height: 250,
    borderRadius: 10,
  },
});
