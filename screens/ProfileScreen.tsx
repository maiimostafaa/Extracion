import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BookmarkedPost {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
}

// Mock data for favorite coffee with detailed information
const favoriteCoffee = [
  {
    id: 1,
    name: "Espresso",
    image: "https://picsum.photos/200/200?random=1",
    description:
      "A concentrated form of coffee brewed by forcing a small amount of nearly boiling water under pressure through finely ground coffee beans.",
    recipe: {
      ingredients: ["18-21g finely ground coffee", "90-95°C water"],
      steps: [
        "Grind coffee beans to a fine consistency",
        "Tamp the grounds evenly",
        "Extract for 25-30 seconds",
        "Serve immediately",
      ],
    },
    cafes: [
      {
        name: "Coffee Lab",
        address: "123 Coffee Street",
        rating: 4.8,
        image: "https://picsum.photos/200/200?random=11",
      },
      {
        name: "Brew & Co",
        address: "456 Bean Avenue",
        rating: 4.6,
        image: "https://picsum.photos/200/200?random=12",
      },
    ],
    additionalImages: [
      "https://picsum.photos/400/300?random=13",
      "https://picsum.photos/400/300?random=14",
      "https://picsum.photos/400/300?random=15",
    ],
  },
  {
    id: 2,
    name: "Cappuccino",
    image: "https://picsum.photos/200/200?random=2",
    description:
      "An espresso-based coffee drink that is traditionally prepared with steamed milk foam.",
    recipe: {
      ingredients: ["1 shot of espresso", "Steamed milk", "Foamed milk"],
      steps: [
        "Pull a shot of espresso",
        "Steam milk to 65°C",
        "Pour steamed milk over espresso",
        "Top with foamed milk",
        "Optional: dust with cocoa powder",
      ],
    },
    cafes: [
      {
        name: "Milk & Coffee",
        address: "789 Latte Lane",
        rating: 4.7,
        image: "https://picsum.photos/200/200?random=16",
      },
      {
        name: "Cafe Milano",
        address: "321 Espresso Road",
        rating: 4.9,
        image: "https://picsum.photos/200/200?random=17",
      },
    ],
    additionalImages: [
      "https://picsum.photos/400/300?random=18",
      "https://picsum.photos/400/300?random=19",
      "https://picsum.photos/400/300?random=20",
    ],
  },
  {
    id: 3,
    name: "Latte",
    image: "https://picsum.photos/200/200?random=3",
    description: "A coffee drink made with espresso and steamed milk.",
    recipe: {
      ingredients: [
        "1 shot of espresso",
        "Steamed milk",
        "Light layer of foam",
      ],
      steps: [
        "Pull a shot of espresso",
        "Steam milk to 65°C",
        "Pour steamed milk over espresso",
        "Add a light layer of foam",
        "Optional: create latte art",
      ],
    },
    cafes: [
      {
        name: "Artisan Coffee",
        address: "555 Brew Boulevard",
        rating: 4.8,
        image: "https://picsum.photos/200/200?random=21",
      },
      {
        name: "The Daily Grind",
        address: "888 Coffee Court",
        rating: 4.5,
        image: "https://picsum.photos/200/200?random=22",
      },
    ],
    additionalImages: [
      "https://picsum.photos/400/300?random=23",
      "https://picsum.photos/400/300?random=24",
      "https://picsum.photos/400/300?random=25",
    ],
  },
];

const STORAGE_KEY = "@social_feed_posts";

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: any[];
  timestamp: string;
  isLiked: boolean;
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [userInfo, setUserInfo] = useState({
    username: "CoffeeLover123",
    id: "CL123456",
    joinDate: "2024-01-15",
  });
  const [selectedCoffee, setSelectedCoffee] = useState<any>(null);
  const [showCoffeeDetails, setShowCoffeeDetails] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks">("posts");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const handleQRCodePress = () => {
    Alert.alert("QR Code", "Your QR Code: CL123456", [
      {
        text: "Share",
        onPress: () => {
          // Implement share functionality
          Alert.alert("Share", "Sharing QR code...");
        },
      },
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  const handleAddFriendPress = () => {
    Alert.alert("Add Friend", "Enter friend's ID or scan their QR code", [
      {
        text: "Scan QR",
        onPress: () => {
          // Implement QR scanning
          Alert.alert("Scan", "Opening camera to scan QR code...");
        },
      },
      {
        text: "Enter ID",
        onPress: () => {
          // Implement ID input
          Alert.alert("Enter ID", "Enter friend's ID...");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const calculateMembershipDays = () => {
    const joinDate = new Date(userInfo.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderFavoriteCoffee = ({ item }: { item: any }) => (
    <View style={styles.coffeeCard}>
      <Image source={{ uri: item.image }} style={styles.coffeeImage} />
      <Text style={styles.coffeeName}>{item.name}</Text>
    </View>
  );

  const renderCoffeeDetails = () => {
    if (!selectedCoffee) return null;

    return (
      <Modal
        visible={showCoffeeDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCoffeeDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedCoffee.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCoffeeDetails(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Main Image */}
              <Image
                source={{ uri: selectedCoffee.image }}
                style={styles.modalMainImage}
              />

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>
                  {selectedCoffee.description}
                </Text>
              </View>

              {/* Recipe */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recipe</Text>
                <View style={styles.recipeContainer}>
                  <Text style={styles.subsectionTitle}>Ingredients</Text>
                  {selectedCoffee.recipe.ingredients.map(
                    (ingredient: string, index: number) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Ionicons name="ellipse" size={8} color="#007AFF" />
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    )
                  )}

                  <Text style={[styles.subsectionTitle, { marginTop: 16 }]}>
                    Steps
                  </Text>
                  {selectedCoffee.recipe.steps.map(
                    (step: string, index: number) => (
                      <View key={index} style={styles.stepItem}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* Recommended Cafes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Where to Get It</Text>
                {selectedCoffee.cafes.map((cafe: any, index: number) => (
                  <View key={index} style={styles.cafeCard}>
                    <Image
                      source={{ uri: cafe.image }}
                      style={styles.cafeImage}
                    />
                    <View style={styles.cafeInfo}>
                      <Text style={styles.cafeName}>{cafe.name}</Text>
                      <Text style={styles.cafeAddress}>{cafe.address}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{cafe.rating}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Additional Images */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gallery</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedCoffee.additionalImages.map(
                    (image: string, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.galleryImage}
                      />
                    )
                  )}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    loadUserData();
    loadUserPosts();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPosts) {
        const allPosts = JSON.parse(storedPosts);
        // Filter posts by current user
        const userPosts = allPosts.filter(
          (post: Post) => post.user.name === (userData?.name || "CurrentUser")
        );
        setUserPosts(userPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.postInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={16} color="#FF3B30" />
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={16} color="#007AFF" />
          <Text style={styles.statText}>{item.comments.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  userData?.avatar || "https://picsum.photos/200/200?random=10",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>{userData?.name || "User Name"}</Text>
          <Text style={styles.userId}>ID: {userInfo.id}</Text>
          <Text style={styles.membership}>
            Member for {calculateMembershipDays()} days
          </Text>
        </View>

        {/* Social Buttons */}
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleQRCodePress}
          >
            <Ionicons name="qr-code" size={24} color="#007AFF" />
            <Text style={styles.socialButtonText}>My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAddFriendPress}
          >
            <Ionicons name="person-add" size={24} color="#007AFF" />
            <Text style={styles.socialButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Favorite Coffee Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Coffee</Text>
          <FlatList
            data={favoriteCoffee}
            renderItem={renderFavoriteCoffee}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coffeeList}
          />
        </View>

        {/* My Posts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          {userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No posts yet</Text>
          )}
        </View>
      </ScrollView>

      {/* Coffee Details Modal */}
      {renderCoffeeDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  membership: {
    fontSize: 14,
    color: "#007AFF",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  socialButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    width: "45%",
  },
  socialButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  coffeeList: {
    paddingRight: 20,
  },
  coffeeCard: {
    width: 120,
    marginRight: 16,
  },
  coffeeImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  coffeeName: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  postCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postInfo: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  postStats: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  modalMainImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  recipeContainer: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ingredientText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
  },
  cafeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cafeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  cafeInfo: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cafeAddress: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});
