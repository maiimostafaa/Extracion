import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "CoffeeLover123",
      avatar: "https://picsum.photos/200/200?random=1",
    },
    content:
      "Just discovered this amazing new coffee shop! Their cold brew is to die for ☕️",
    image: "https://picsum.photos/400/300?random=2",
    likes: 42,
    comments: [],
    timestamp: "2h ago",
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Coffee Connect",
      avatar: "https://picsum.photos/200/200?random=3",
    },
    content:
      "Did you know? The first coffee shop opened in Constantinople in 1475! 🏛️",
    image: "https://picsum.photos/400/300?random=4",
    likes: 89,
    comments: [],
    timestamp: "4h ago",
    liked: true,
  },
  {
    id: "3",
    user: {
      name: "Coffee Connect",
      avatar: "https://picsum.photos/200/200?random=5",
    },
    content:
      "Coffee tip: Store your beans in an airtight container away from sunlight for maximum freshness! 🌟",
    image: "https://picsum.photos/400/300?random=6",
    likes: 56,
    comments: [],
    timestamp: "6h ago",
    liked: false,
  },
  {
    id: "4",
    user: {
      name: "Coffee Connect",
      avatar: "https://picsum.photos/200/200?random=7",
    },
    content:
      "Happy International Coffee Day! Share your favorite coffee moment below! ☕️✨",
    image: "https://picsum.photos/400/300?random=8",
    likes: 78,
    comments: [],
    timestamp: "8h ago",
    liked: false,
  },
];

const STORAGE_KEY = "@social_feed_posts";

export default function SocialFeedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showWritePost, setShowWritePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  // Load posts from storage
  useFocusEffect(
    React.useCallback(() => {
      const loadPosts = async () => {
        try {
          const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
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
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(initialPosts)
            );
            setPosts(initialPosts);
          }
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };

      loadPosts();
    }, [])
  );

  // Save posts to storage
  useEffect(() => {
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      } catch (error) {
        console.error("Error saving posts:", error);
      }
    };

    savePosts();
  }, [posts]);

  const handleWritePostPress = () => {
    navigation.navigate("EditPost");
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            likes: newLiked ? post.likes + 1 : post.likes - 1,
            liked: newLiked,
          };
        }
        return post;
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating post likes:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        user: {
          name: "Current User",
          avatar: require("../assets/icon.png"),
        },
        content: newComment,
        timestamp: "Just now",
      };

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
          };
        }
        return post;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setNewComment("");
      setShowCommentInput(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={post.user.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      {post.image && <Image source={post.image} style={styles.postImage} />}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={24}
            color={post.liked ? "#FF3B30" : "#666"}
          />
          <Text style={[styles.actionText, post.liked && styles.likedText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCommentInput(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      {showCommentInput === post.id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.commentSubmitButton}
            onPress={() => handleAddComment(post.id)}
          >
            <Text style={styles.commentSubmitText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      {post.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image
                source={comment.user.avatar}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>{comment.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
        <TouchableOpacity
          style={styles.writePostButton}
          onPress={handleWritePostPress}
        >
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  writePostButton: {
    padding: 8,
  },
  content: {
    padding: 16,
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
});
