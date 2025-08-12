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
import type { RootStackParamList } from "../../navigation/AppNavigator";
import Header from "../../navigation/Header";
import NewsletterCard from "../../assets/components/home-components/Newsletter";
import HomePageFilterSelector from "../../assets/components/home-components/HomePageFilterSelector";
import ShopWebViewModal from "../shop/ShopWebViewModal";
import mockNewsletters from "../../assets/mock_data/mock-newsletter-items";
import { newsletterItem } from "../../assets/types/newsletter-item";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type filterOptions = "All" | "Coffee Recipe" | "KOL Featuring" | "Promotion";

const { width } = Dimensions.get("window");
const frames = [
  require("../../assets/animations/vaaka-animation/1.png"),
  require("../../assets/animations/vaaka-animation/2.png"),
  require("../../assets/animations/vaaka-animation/3.png"),
  require("../../assets/animations/vaaka-animation/4.png"),
  require("../../assets/animations/vaaka-animation/5.png"),
  require("../../assets/animations/vaaka-animation/6.png"),
  require("../../assets/animations/vaaka-animation/7.png"),
  require("../../assets/animations/vaaka-animation/8.png"),
  require("../../assets/animations/vaaka-animation/9.png"),
  require("../../assets/animations/vaaka-animation/10.png"),
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState<newsletterItem[]>([]);
  const [showShopModal, setShowShopModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [animationFrame, setAnimationFrame] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<filterOptions>("All");

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

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      const accessToken =
        "EAAQ3NxrYDg0BPIcHVILfIZC6lax4WYBgoT64sCvnFnFxitKvQwSrMasmUDxElgSr4OGnrTqqgGC3vymCoVr6fDPzEgO3h3XIBZBRZBhY3fjKgE8Jtv0QgU2yKJQZAEc96Umw1NgsxSO9L39ZAasyGSsc8fIWMArcTrDIvOPyQB7QyuuaLR2DGbcmumoSIUrjcZAhZCnZCZA2AOlwg6QZDZD";
      const baseUrl = `https://graph.facebook.com/v18.0/17841408709139123/media`;
      try {
        const response = await fetch(
          `${baseUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp,children&access_token=${accessToken}`
        );
        const json = await response.json();
        const posts: InstagramPost[] = json.data;

        // Convert each post into a format compatible with NewsletterCar

        if (!json.data || !Array.isArray(json.data)) {
          console.warn("Instagram response missing data field:", json);
          return;
        }

        interface InstagramPost {
          id: string;
          caption?: string;
          thumbnail_url: string;
          media_url: string;
          permalink: string;
          timestamp: string;
          media_type: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
          children?: {
            data: { id: string }[];
          };
          like_count: string;
          comments_count: string;
        }

        const formatted = await Promise.all(
          posts.map(async (post: InstagramPost) => {
            let media_urls: string[] = [];
            let media_types: string[] = [];

            // For CAROUSEL posts, fetch each child media
            if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data) {
              const childMedia = await Promise.all(
                post.children.data.map(async (child: { id: string }) => {
                  const childRes = await fetch(
                    `https://graph.facebook.com/v18.0/${child.id}?fields=media_url,media_type,thumbnail_url&access_token=${accessToken}`
                  );
                  const childJson = await childRes.json();
                  return {
                    url: childJson.media_url || childJson.thumbnail_url,
                    type: childJson.media_type,
                  };
                })
              );

              media_urls = childMedia.map((child) => child.url);
              media_types = childMedia.map((child) => child.type);
            } else {
              // Regular image or video
              media_urls = [post.media_url || post.thumbnail_url];
              media_types = [post.media_type];
            }

            return {
              id: `insta-${post.id}`,
              title: post.caption?.slice(0, 300) || "Instagram Post",
              description: post.caption || "No description available",
              media_urls,
              media_url: media_urls[0],
              media_types,
              thumbnail: post.thumbnail_url || media_urls[0],
              createdBy: "getthepong",
              category: "KOL Featuring" as "KOL Featuring",
              date: post.timestamp,
              permalink: post.permalink,
              like_count: post.like_count,
              comments_count: post.comments_count,
            };
          })
        );

        setInstagramPosts(formatted);
      } catch (err) {
        console.error("Failed to fetch IG posts:", err);
      }
    };

    fetchInstagramFeed();
  }, []);

  const filteredData = useMemo(() => {
    const combined = [...instagramPosts, ...mockNewsletters];
    if (selectedFilter === "All") return combined;
    return combined.filter((entry) => entry.category === selectedFilter);
  }, [selectedFilter, instagramPosts]);

  const handleFilterChange = (newFilter: filterOptions) => {
    setSelectedFilter(newFilter);
  };

  const handleWallet = () => {
    navigation.navigate("Wallet");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Banner Header - Outside ScrollView */}
      <View style={[styles.header, { zIndex: 1000 }]}>
        <Image source={frames[animationFrame]} style={styles.headerImage} />
        <View style={styles.overlayContent}>
          <SafeAreaView
            style={{
              top: 3,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
            }}
          >
            <Header tintColor="#fff" />
          </SafeAreaView>

          <View style={styles.textOverlayContainer}>
            <Text style={styles.greeting}>Hello Miss Wong</Text>
            <View style={styles.pointsContainer}>
              <View style={styles.border}>
                <Text style={styles.points}>
                  Points{" "}
                  <Text style={{ fontWeight: "600", fontFamily: "default" }}>
                    23{"  "}
                    <TouchableOpacity
                      style={{ borderRadius: 4, backgroundColor: "#8CDBED" }}
                      onPress={handleWallet}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          fontFamily: "default",
                          color: "#fff",
                        }}
                      >
                        {"   "}${"   "}
                      </Text>
                    </TouchableOpacity>
                    {"    "}
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
          </View>
        </View>
      </View>

      {/* Scrollable Content Below Fixed Banner */}

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
        stickyHeaderIndices={[1]} // Only make filter sticky (now index 1)
      >
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
            <TouchableOpacity onPress={() => setShowShopModal(true)}>
              <ImageBackground
                source={require("../../assets/backgrounds/button-backgrounds/barista-classes-bg.png")}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("CafeFinderScreen")}
            >
              <ImageBackground
                source={require("../../assets/backgrounds/button-backgrounds/cafe-finder-bg.png")}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowShopModal(true)}>
              <ImageBackground
                source={require("../../assets/backgrounds/button-backgrounds/cafe-event-bg.png")}
                style={{ width: 200, height: 250, borderRadius: 10 }}
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

      <ShopWebViewModal
        visible={showShopModal}
        onClose={() => setShowShopModal(false)}
      />
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
    width: "101%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    left: -1,
  },
  overlayContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    height: "100%",
  },
  textOverlayContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  pointsContainer: {
    flexDirection: "row",
    marginTop: -5,
  },
  greeting: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 8,
    fontFamily: "cardRegular",
  },
  points: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "cardRegular",
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
    marginRight: -20,
  },
  walletContainer: {
    backgroundColor: "#8CDBED",
  },
});
