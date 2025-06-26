import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConnectScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Featured Connections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Connections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <TouchableOpacity key={item} style={styles.connectionCard}>
                <Image
                  source={{ uri: 'https://picsum.photos/200' }}
                  style={styles.connectionImage}
                />
                <View style={styles.connectionInfo}>
                  <Text style={styles.connectionName}>Coffee Enthusiast {item}</Text>
                  <Text style={styles.connectionBio}>Barista & Coffee Lover</Text>
                  <TouchableOpacity style={styles.connectButton}>
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nearby Coffee Lovers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Coffee Lovers</Text>
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.nearbyCard}>
              <Image
                source={{ uri: 'https://picsum.photos/200' }}
                style={styles.nearbyImage}
              />
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyName}>Coffee Lover {item}</Text>
                <Text style={styles.nearbyDistance}>0.{item} km away</Text>
                <Text style={styles.nearbyBio}>Passionate about specialty coffee</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coffee Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coffee Groups</Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.groupCard}>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Coffee Group {item}</Text>
                <Text style={styles.groupMembers}>{item * 10} members</Text>
                <Text style={styles.groupDescription}>
                  A community of coffee enthusiasts sharing experiences and knowledge
                </Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  connectionCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectionImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  connectionInfo: {
    padding: 12,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  connectionBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  nearbyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nearbyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nearbyDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nearbyBio: {
    fontSize: 14,
    color: '#666',
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupInfo: {
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 