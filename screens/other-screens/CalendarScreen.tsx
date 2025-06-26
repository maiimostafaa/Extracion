import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'pickup' | 'event' | 'workshop';
  time?: string;
  location?: string;
  description?: string;
}

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dots: Array<{
      color: string;
    }>;
  };
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useFocusEffect(
    React.useCallback(() => {
      loadEvents();
    }, [])
  );

  useEffect(() => {
    updateMarkedDates();
  }, [events]);

  const loadEvents = async () => {
    try {
      // Load events from different sources
      const [storedEvents, workshopEvents, recycleEvents] = await Promise.all([
        AsyncStorage.getItem('events'),
        AsyncStorage.getItem('workshopRegistrations'),
        AsyncStorage.getItem('recycleHistory'),
      ]);

      // Use a Map to track unique events by their ID
      const eventsMap = new Map<string, Event>();

      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        events.forEach((event: Event) => {
          eventsMap.set(event.id, event);
        });
      }

      if (workshopEvents) {
        const workshops = JSON.parse(workshopEvents).map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          type: 'workshop' as const,
          time: event.time,
          location: event.location,
          description: event.description,
        }));
        workshops.forEach((event: Event) => {
          eventsMap.set(event.id, event);
        });
      }

      if (recycleEvents) {
        const recycles = JSON.parse(recycleEvents).map((event: any) => ({
          id: event.id,
          title: 'Recycle Pickup',
          date: event.date,
          type: 'pickup' as const,
          time: event.timeSlot,
          location: event.store,
          description: `Scheduled pickup for ${event.weight}kg of recyclable materials. You earned ${event.points} points!`,
        }));
        recycles.forEach((event: Event) => {
          eventsMap.set(event.id, event);
        });
      }

      // Convert Map values back to array
      setEvents(Array.from(eventsMap.values()));
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const updateMarkedDates = () => {
    const marked: MarkedDates = {};
    events.forEach(event => {
      if (!marked[event.date]) {
        marked[event.date] = {
          marked: true,
          dots: [],
        };
      }
      const color = event.type === 'pickup' ? '#4CAF50' : 
                   event.type === 'workshop' ? '#FF9500' : '#007AFF';
      marked[event.date].dots.push({ color });
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const dayEvents = events.filter(event => event.date === day.dateString);
    if (dayEvents.length > 0) {
      setSelectedEvents(dayEvents);
      setCurrentEventIndex(0);
      setShowEventDetails(true);
    }
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % selectedEvents.length);
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + selectedEvents.length) % selectedEvents.length);
  };

  const renderEventDetails = () => {
    if (!selectedEvents.length) return null;
    const event = selectedEvents[currentEventIndex];

    return (
      <View style={styles.eventDetails}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <TouchableOpacity
            onPress={() => setShowEventDetails(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.eventInfo}>
          <View style={styles.infoRow}>
            <Ionicons
              name={event.type === 'pickup' ? 'leaf' : 
                    event.type === 'workshop' ? 'school' : 'calendar'}
              size={20}
              color="#666"
            />
            <Text style={styles.infoText}>
              {event.type === 'pickup' ? 'Recycle Pickup' : 
               event.type === 'workshop' ? 'Workshop' : 'Event'}
            </Text>
          </View>
          {event.time && (
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.infoText}>{event.time}</Text>
            </View>
          )}
          {event.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
          )}
          {event.description && (
            <Text style={styles.eventDescription}>
              {event.description}
            </Text>
          )}
        </View>
        {selectedEvents.length > 1 && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevEvent}
            >
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.eventCounter}>
              {currentEventIndex + 1} / {selectedEvents.length}
            </Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextEvent}
            >
              <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          todayTextColor: '#007AFF',
          selectedDayBackgroundColor: '#007AFF',
          dotColor: '#007AFF',
          selectedDotColor: '#fff',
        }}
      />
      <Modal
        visible={showEventDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEventDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderEventDetails()}
          </View>
        </View>
      </Modal>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  eventDetails: {
    width: '100%',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  eventInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  navButton: {
    padding: 8,
  },
  eventCounter: {
    fontSize: 16,
    color: '#666',
  },
}); 