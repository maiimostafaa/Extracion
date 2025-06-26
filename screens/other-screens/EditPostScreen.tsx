import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPostScreen() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    try {
      // Create new post
      const newPost = {
        id: Date.now().toString(),
        user: {
          name: 'Current User',
          avatar: require('../assets/icon.png'),
        },
        content: content.trim(),
        image: selectedImage,
        likes: 0,
        comments: [],
        timestamp: 'Just now',
        liked: false,
      };

      // Get existing posts
      const storedPosts = await AsyncStorage.getItem('posts');
      const posts = storedPosts ? JSON.parse(storedPosts) : [];
      
      // Add new post
      const updatedPosts = [newPost, ...posts];
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));

      // Create notification
      const newNotification = {
        id: Date.now().toString(),
        title: 'New Post Created',
        message: 'Your post has been published successfully!',
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Get existing notifications
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      // Add new notification
      const updatedNotifications = [newNotification, ...notifications];
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      // Navigate back and show success message
      navigation.goBack();
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            !content.trim() && styles.postButtonDisabled
          ]}
          onPress={handleCreatePost}
          disabled={!content.trim()}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />
        
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={selectedImage} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.addImageButton}
          onPress={() => {
            // TODO: Implement image picker
            Alert.alert('Coming Soon', 'Image upload will be available soon!');
          }}
        >
          <Ionicons name="image-outline" size={24} color="#007AFF" />
          <Text style={styles.addImageText}>Add Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  imagePreview: {
    marginTop: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addImageText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
}); 