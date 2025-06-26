import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../navigation/AppNavigator";
import Header from "../navigation/Header";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

// Mock data for the banner
const banners = [
  { id: 1, image: "https://picsum.photos/800/400?random=1" },
  { id: 2, image: "https://picsum.photos/800/400?random=2" },
  { id: 3, image: "https://picsum.photos/800/400?random=3" },
];

// Mock data for the content sections
const mockPosts = [
  {
    id: 1,
    title: "New Product Launch",
    image: "https://picsum.photos/400/300?random=4",
  },
  {
    id: 2,
    title: "Special Offer",
    image: "https://picsum.photos/400/300?random=5",
  },
  {
    id: 3,
    title: "Limited Time Deal",
    image: "https://picsum.photos/400/300?random=6",
  },
];

const mockCafes: Cafe[] = [
  {
    id: 1,
    name: "Urban Coffee Lab",
    coordinate: { latitude: 37.7749, longitude: -122.4194 },
    rating: 4.5,
    image: "https://picsum.photos/400/300?random=1",
    address: "123 Coffee Street, San Francisco",
    openingHours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Brew & Co",
    coordinate: { latitude: 37.7833, longitude: -122.4167 },
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=2",
    address: "456 Brew Avenue, San Francisco",
    openingHours: "Mon-Sun: 6AM-10PM",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    name: "Coffee House",
    coordinate: { latitude: 37.785, longitude: -122.4067 },
    rating: 4.3,
    image: "https://picsum.photos/400/300?random=3",
    address: "789 Bean Road, San Francisco",
    openingHours: "Mon-Fri: 6:30AM-7PM, Sat-Sun: 7AM-8PM",
    phone: "(555) 345-6789",
  },
  {
    id: 4,
    name: "Café de Flore",
    coordinate: { latitude: 48.8534, longitude: 2.3347 },
    rating: 4.7,
    image: "https://picsum.photos/400/300?random=4",
    address: "172 Boulevard Saint-Germain, Paris",
    openingHours: "Mon-Sun: 7AM-1AM",
    phone: "+33 1 45 48 55 26",
  },
  {
    id: 5,
    name: "Blue Bottle Coffee",
    coordinate: { latitude: 35.6895, longitude: 139.7637 },
    rating: 4.6,
    image: "https://picsum.photos/400/300?random=5",
    address: "1-4-1 Kojimachi, Chiyoda City, Tokyo",
    openingHours: "Mon-Sun: 8AM-8PM",
    phone: "+81 3 6261 5383",
  },
  {
    id: 6,
    name: "Café Central",
    coordinate: { latitude: 48.2082, longitude: 16.3719 },
    rating: 4.9,
    image: "https://picsum.photos/400/300?random=6",
    address: "Herrengasse 14, Vienna",
    openingHours: "Mon-Sat: 7:30AM-10PM, Sun: 10AM-10PM",
    phone: "+43 1 533 37 63",
  },
  {
    id: 7,
    name: "Café Tortoni",
    coordinate: { latitude: -34.6037, longitude: -58.3816 },
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=7",
    address: "Av. de Mayo 825, Buenos Aires",
    openingHours: "Mon-Sun: 8AM-1AM",
    phone: "+54 11 4342 4328",
  },
  {
    id: 8,
    name: "Café de la Paix",
    coordinate: { latitude: 48.8719, longitude: 2.3317 },
    rating: 4.7,
    image: "https://picsum.photos/400/300?random=8",
    address: "5 Place de l'Opéra, Paris",
    openingHours: "Mon-Sun: 7AM-11PM",
    phone: "+33 1 40 07 36 36",
  },
];

const mockLessons = [
  {
    id: 1,
    title: "Espresso Basics",
    image: "https://picsum.photos/400/300?random=10",
    duration: "2 hours",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Latte Art",
    image: "https://picsum.photos/400/300?random=11",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Coffee Tasting",
    image: "https://picsum.photos/400/300?random=12",
    duration: "1.5 hours",
    level: "All Levels",
  },
];

// Add new mock data for carousels

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Item {
  id: string;
  name: string;
  image: string;
  producer: string;
  origin: string;
  price: number;
  weight: number;
  taste: string[];
  description: string;
  comments: any[];
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: any;
  };
  content: string;
  image?: any;
  likes: number;
  comments: Comment[];
  timestamp: string;
  liked: boolean;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: any;
  };
  content: string;
  timestamp: string;
}

interface Cafe {
  id: number;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  image: string;
  address: string;
  openingHours: string;
  phone: string;
}

export default function HomeScreen() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation<NavigationProp>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [recyclePoints, setRecyclePoints] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showWritePost, setShowWritePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  // Auto-scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Load data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
      loadNotifications();
      loadRecyclePoints();
    }, [])
  );

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
      } else {
        // Initialize with empty array if no notifications exist
        setNotifications([]);
        await AsyncStorage.setItem("notifications", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  };

  const loadRecyclePoints = async () => {
    try {
      const points = await AsyncStorage.getItem("recyclePoints");
      if (points) {
        setRecyclePoints(parseInt(points));
      } else {
        // Initialize points if not set
        await AsyncStorage.setItem("recyclePoints", "0");
        setRecyclePoints(0);
      }
    } catch (error) {
      console.error("Error loading recycle points:", error);
    }
  };

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem("posts");
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Initialize with sample posts if none exist
        const initialPosts = [
          {
            id: "1",
            user: {
              name: "Coffee Lover",
              avatar: require("../assets/icon.png"),
            },
            content:
              "Just discovered this amazing new coffee shop! Their cold brew is to die for! ☕️",
            image: require("../assets/icon.png"),
            likes: 24,
            comments: [
              {
                id: "1",
                user: {
                  name: "Barista Pro",
                  avatar: require("../assets/icon.png"),
                },
                content: "Their cold brew is indeed amazing!",
                timestamp: "1h ago",
              },
            ],
            timestamp: "2h ago",
            liked: false,
          },
        ];
        await AsyncStorage.setItem("posts", JSON.stringify(initialPosts));
        setPosts(initialPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };
  const handleWallet = () => {
    navigation.navigate("Wallet");
  };

  const clearAllAppData = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();

      // Remove all data
      await AsyncStorage.multiRemove(keys);

      // Reinitialize storage with default values
      await AsyncStorage.setItem("notifications", JSON.stringify([]));
      await AsyncStorage.setItem("posts", JSON.stringify([]));
      await AsyncStorage.setItem("recyclePoints", "0");

      // Reset all state
      setPosts([]);
      setNotifications([]);
      setRecyclePoints(0);

      // Reload data
      loadPosts();
      loadNotifications();
      loadRecyclePoints();

      Alert.alert("Success", "All app data has been cleared successfully");
    } catch (error) {
      console.error("Error clearing app data:", error);
      Alert.alert("Error", "Failed to clear app data. Please try again.");
    }
  };

  const renderLesson = ({ item }: { item: (typeof mockLessons)[0] }) => (
    <TouchableOpacity style={styles.lessonCard}>
      <Image source={{ uri: item.image }} style={styles.lessonImage} />
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <View style={styles.lessonDetails}>
          <Text style={styles.lessonDuration}>{item.duration}</Text>
          <Text style={styles.lessonLevel}>{item.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/backgrounds/bg-1.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Banner */}
          <View style={styles.section}>
            <Text style={styles.headerTitle}>news & promotion &gt;</Text>
            <View />
            <ScrollView
              style={styles.bannerContainer}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentBanner(newIndex);
              }}
            >
              {banners.map((banner) => (
                <Image
                  key={banner.id}
                  source={{ uri: banner.image }}
                  style={styles.bannerImage}
                />
              ))}
            </ScrollView>
            <View style={styles.bannerDots}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bannerDot,
                    index === currentBanner && styles.bannerDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
          {/* cafe finder */}
          <View style={styles.section}>
            <Text style={styles.headerTitle}>café finder &gt;</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cafesContainer}
            >
              {mockCafes.map((cafe) => (
                <TouchableOpacity
                  key={cafe.id}
                  style={styles.cafeCard}
                  // onPress={() => handleCafePress(cafe)}
                >
                  <Image
                    source={{ uri: cafe.image }}
                    style={styles.cafeImage}
                  />
                  <View style={styles.cafeInfo}>
                    <Text style={styles.cafeName}>{cafe.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{cafe.rating}</Text>
                    </View>
                    <Text style={styles.cafeAddress}>{cafe.address}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* social feeds */}
          <View style={styles.section}>
            <Text style={styles.headerTitle}>social feeds &gt;</Text>
            <FlatList
              data={mockLessons}
              renderItem={renderLesson}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleWallet}>
          <Ionicons name="wallet-outline" size={32} color="#000" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: -30,
  },
  headerTitle: {
    fontSize: 24,
    color: "#8CDBED",
    fontFamily: "second",
    marginBottom: 20,
  },
  bannerContainer: {
    height: 200,
    position: "relative",
    marginTop: -5,
    marginLeft: -16,
    width: width,
  },
  bannerImage: {
    width,
    height: 200,
    resizeMode: "cover",
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 25,
    width: "100%",
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  bannerDotActive: {
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  recycleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 12,
  },
  recycleInfo: {
    flex: 1,
  },
  recycleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recyclePoints: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  recycleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recycleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  lessonCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  lessonInfo: {
    padding: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  lessonDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lessonDuration: {
    fontSize: 14,
    color: "#666",
  },
  lessonLevel: {
    fontSize: 14,
    color: "#007AFF",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  addMenu: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 24,
  },
  modalTime: {
    fontSize: 14,
    color: "#999",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    lineHeight: 24,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  likedText: {
    color: "#FF3B30",
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  commentSubmitButton: {
    justifyContent: "center",
  },
  commentSubmitText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
  },
  voucherCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  voucherImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  voucherInfo: {
    padding: 12,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  voucherCode: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  voucherExpiry: {
    fontSize: 12,
    color: "#666",
  },
  coffeeCard: {
    width: 180,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coffeeImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  coffeeInfo: {
    padding: 12,
  },
  coffeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  coffeeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coffeePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  classCard: {
    width: 220,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  classInfo: {
    padding: 12,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  classDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  classMeta: {
    flexDirection: "row",
    gap: 8,
  },
  classDuration: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  classLevel: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  postInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  createPostButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createPostButtonDisabled: {
    backgroundColor: "#ccc",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    position: "absolute",
    top: 12,
    right: 12,
  },
  clearDataItem: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
    paddingTop: 16,
  },
  clearDataText: {
    color: "#FF3B30",
  },
  cafesContainer: {
    paddingHorizontal: 16,
  },
  cafeCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cafeImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  cafeInfo: {
    padding: 12,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  cafeAddress: {
    fontSize: 14,
    color: "#666",
  },
  cafeDetails: {
    width: "100%",
    height: "100%",
  },
  cafeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cafeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  cafeContent: {
    flex: 1,
  },
  cafeModalImage: {
    width: "100%",
    height: width * 0.4, // 40% of screen width
    borderRadius: 12,
    marginBottom: 16,
  },
});
