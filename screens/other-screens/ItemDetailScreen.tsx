import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ItemDetailRouteProp = RouteProp<RootStackParamList, "ItemDetail">;

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  rating: number;
  timestamp: string;
}

interface ItemDetails {
  id: string;
  name: string;
  image: string;
  producer: string;
  origin: string;
  price: number;
  weight: number;
  taste: string[];
  description: string;
  comments: Comment[];
}

export default function ItemDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ItemDetailRouteProp>();
  const { itemId } = route.params;

  const [item, setItem] = useState<ItemDetails | null>(null);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    loadItemDetails();
  }, [itemId]);

  const loadItemDetails = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("@items_details");
      if (storedItems) {
        const items = JSON.parse(storedItems);
        const foundItem = items.find((i: ItemDetails) => i.id === itemId);
        if (foundItem) {
          setItem(foundItem);
        }
      }
    } catch (error) {
      console.error("Error loading item details:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !item) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "CurrentUser",
        avatar: "https://picsum.photos/200/200?random=10",
      },
      content: commentText.trim(),
      rating,
      timestamp: "Just now",
    };

    const updatedItem = {
      ...item,
      comments: [...item.comments, newComment],
    };

    try {
      const storedItems = await AsyncStorage.getItem("@items_details");
      if (storedItems) {
        const items = JSON.parse(storedItems);
        const updatedItems = items.map((i: ItemDetails) =>
          i.id === itemId ? updatedItem : i
        );
        await AsyncStorage.setItem(
          "@items_details",
          JSON.stringify(updatedItems)
        );
        setItem(updatedItem);
        setCommentText("");
        setRating(5);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const renderComment = ({ item: comment }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user.avatar }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{comment.user.name}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= comment.rating ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
      </View>
    </View>
  );

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Producer:</Text>
            <Text style={styles.detailValue}>{item.producer}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Origin:</Text>
            <Text style={styles.detailValue}>{item.origin}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>${item.price.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{item.weight}g</Text>
          </View>

          <View style={styles.tasteContainer}>
            <Text style={styles.detailLabel}>Taste Profile:</Text>
            <View style={styles.tasteTags}>
              {item.taste.map((taste, index) => (
                <View key={index} style={styles.tasteTag}>
                  <Text style={styles.tasteText}>{taste}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <FlatList
            data={item.comments}
            renderItem={renderComment}
            keyExtractor={(comment) => comment.id}
            scrollEnabled={false}
          />

          <View style={styles.commentInputContainer}>
            <View style={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={24}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={styles.postButton}
              onPress={handleAddComment}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  itemImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  tasteContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  tasteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tasteTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tasteText: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginTop: 16,
  },
  commentsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  commentInputContainer: {
    marginTop: 16,
  },
  ratingInput: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
