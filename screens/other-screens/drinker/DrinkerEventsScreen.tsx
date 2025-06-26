import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  image: any;
}

export default function DrinkerEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // Mock data for events
      setEvents([
        {
          id: '1',
          title: 'Latte Art Workshop',
          description: 'Learn the art of creating beautiful latte designs from professional baristas.',
          date: '2024-03-20',
          time: '2:00 PM',
          location: 'Coffee Haven',
          capacity: 20,
          registered: 15,
          image: require('../../assets/icon.png'),
        },
        {
          id: '2',
          title: 'Coffee Tasting Session',
          description: 'Experience different coffee varieties and learn about their unique flavors.',
          date: '2024-03-25',
          time: '3:00 PM',
          location: 'Brew & Bean',
          capacity: 15,
          registered: 8,
          image: require('../../assets/icon.png'),
        },
      ]);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.registered >= event.capacity) {
      Alert.alert('Full', 'This event is already full.');
      return;
    }

    // Check if user is already registered
    const isRegistered = event.registered > 0;

    Alert.alert(
      isRegistered ? 'Unregister from Event' : 'Confirm Registration',
      isRegistered 
        ? `Would you like to unregister from ${event.title}?`
        : `Would you like to register for ${event.title}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: isRegistered ? 'Unregister' : 'Register',
          style: isRegistered ? 'destructive' : 'default',
          onPress: async () => {
            try {
              // Update event registration
              const registrations = await AsyncStorage.getItem('workshopRegistrations');
              const registeredEvents = registrations ? JSON.parse(registrations) : [];
              const updatedEvents = registeredEvents.find((r: any) => r.id === event.id)
                ? registeredEvents.map((r: any) =>
                    r.id === event.id 
                      ? { ...r, registered: isRegistered ? r.registered - 1 : r.registered + 1 } 
                      : r
                  )
                : [...registeredEvents, { ...event, registered: 1 }];
              await AsyncStorage.setItem('workshopRegistrations', JSON.stringify(updatedEvents));

              // Create notification
              const notification = {
                id: Date.now(),
                type: 'workshop',
                title: isRegistered ? 'Event Unregistration Confirmed' : 'Event Registration Confirmed',
                message: isRegistered
                  ? `You have successfully unregistered from ${event.title}`
                  : `You have successfully registered for ${event.title} on ${event.date} at ${event.time}`,
                timestamp: 'Just now',
                read: false,
                eventDetails: {
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                },
              };

              const existingNotifications = await AsyncStorage.getItem('notifications');
              const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
              await AsyncStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

              // Update local state
              setEvents(prevEvents =>
                prevEvents.map(e =>
                  e.id === event.id 
                    ? { ...e, registered: isRegistered ? e.registered - 1 : e.registered + 1 } 
                    : e
                )
              );

              Alert.alert(
                'Success', 
                isRegistered 
                  ? 'You have successfully unregistered from the event!'
                  : 'You have successfully registered for the event!'
              );
            } catch (error) {
              console.error('Error updating event registration:', error);
              Alert.alert('Error', 'Failed to update event registration. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderEvent = (event: Event) => (
    <View key={event.id} style={styles.eventCard}>
      <Image source={event.image} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>
        <View style={styles.capacityContainer}>
          <Text style={styles.capacityText}>
            {event.registered}/{event.capacity} registered
          </Text>
          <TouchableOpacity
            style={[
              styles.registerButton,
              event.registered >= event.capacity && styles.registerButtonDisabled,
              event.registered > 0 && styles.registeredButton,
            ]}
            onPress={() => handleRegister(event.id)}
            disabled={event.registered >= event.capacity}
          >
            <Text style={styles.registerButtonText}>
              {event.registered >= event.capacity 
                ? 'Full' 
                : event.registered > 0 
                  ? 'Registered' 
                  : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events & Workshops</Text>
      </View>
      <ScrollView style={styles.content}>
        {events.map(renderEvent)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
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
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  capacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 14,
    color: '#666',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registeredButton: {
    backgroundColor: '#4CAF50',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 