import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  images?: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export default function DrinkerSocialScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [commentInputVisible, setCommentInputVisible] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('currentUser'); // Replace with actual user ID

  useFocusEffect(
    useCallback(() => {
      loadPosts();
      loadCurrentUser();
    }, [])
  );

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id, username } = JSON.parse(userData);
        setCurrentUserId(id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Initialize with sample posts if none exist
        const samplePosts: Post[] = [
          {
            id: '1',
            userId: 'user1',
            username: 'CoffeeLover',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'Just discovered this amazing new coffee shop! Their cold brew is to die for!',
            likes: 15,
            likedBy: [],
            comments: [],
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            userId: 'user2',
            username: 'BaristaPro',
            avatar: 'https://i.pravatar.cc/150?img=2',
            content: 'Learning latte art today! Check out my first attempt!',
            images: ['https://picsum.photos/400/300'],
            likes: 23,
            likedBy: [],
            comments: [],
            timestamp: new Date().toISOString(),
          },
        ];
        await AsyncStorage.setItem('posts', JSON.stringify(samplePosts));
        setPosts(samplePosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likedBy.includes(currentUserId);
          return {
            ...post,
            likes: hasLiked ? post.likes - 1 : post.likes + 1,
            likedBy: hasLiked
              ? post.likedBy.filter(id => id !== currentUserId)
              : [...post.likedBy, currentUserId],
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('userData');
      const { username } = userData ? JSON.parse(userData) : { username: 'CurrentUser' };

      const comment: Comment = {
        id: Date.now().toString(),
        userId: currentUserId,
        username,
        content: newComment,
        timestamp: new Date().toISOString(),
      };

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setNewComment('');
      setCommentInputVisible(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('userData');
      const { username } = userData ? JSON.parse(userData) : { username: 'CurrentUser' };

      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUserId,
        username,
        avatar: 'https://i.pravatar.cc/150?img=3',
        content: newPostContent,
        images: selectedImages,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: new Date().toISOString(),
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setNewPostContent('');
      setSelectedImages([]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, []);

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.postHeaderInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.images && post.images.length > 0 && (
        <Image source={{ uri: post.images[0] }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Ionicons
            name={post.likedBy.includes(currentUserId) ? 'heart' : 'heart-outline'}
            size={24}
            color={post.likedBy.includes(currentUserId) ? '#FF3B30' : '#007AFF'}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCommentInputVisible(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {post.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {post.comments.map(comment => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
        </View>
      )}

      {commentInputVisible === post.id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => handleAddComment(post.id)}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.createPostContainer}>
        <TextInput
          style={styles.postInput}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChangeText={setNewPostContent}
          multiline
        />
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createPostButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={post => post.id}
        contentContainerStyle={styles.postsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  createPostContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  postInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
    minHeight: 40,
  },
  createPostButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsList: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    color: '#666',
  },
  commentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  comment: {
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    minHeight: 40,
  },
  commentButton: {
    padding: 8,
  },
}); 